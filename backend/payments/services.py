import requests
from decimal import Decimal
from django.conf import settings
from django.db import transaction
from .models import PaymentIntent, ExpertPayout, ExpertPaymentMethod

class WiseService:
    """Service for handling Wise payment operations"""
    API_URL = 'https://api.wise.com'
    
    def __init__(self):
        self.api_key = settings.WISE_API_KEY
        self.profile_id = settings.WISE_PROFILE_ID
        
    def _get_headers(self):
        return {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
    def create_quote(self, source_amount, source_currency='USD', target_currency='KES'):
        """Create a quote for currency conversion"""
        endpoint = f'{self.API_URL}/v3/quotes'
        payload = {
            'sourceCurrency': source_currency,
            'targetCurrency': target_currency,
            'sourceAmount': float(source_amount),
            'profile': self.profile_id
        }
        
        response = requests.post(
            endpoint,
            headers=self._get_headers(),
            json=payload
        )
        response.raise_for_status()
        return response.json()
        
    def create_transfer(self, quote_id, account_holder_name, phone_number):
        """Create a transfer using a quote"""
        endpoint = f'{self.API_URL}/v1/transfers'
        payload = {
            'targetAccount': {
                'type': 'phone',
                'phone': phone_number,
                'accountHolderName': account_holder_name,
                'currency': 'KES'
            },
            'quoteUuid': quote_id
        }
        
        response = requests.post(
            endpoint,
            headers=self._get_headers(),
            json=payload
        )
        response.raise_for_status()
        return response.json()
        
    def fund_transfer(self, transfer_id):
        """Fund a transfer using your Wise balance"""
        endpoint = f'{self.API_URL}/v3/profiles/{self.profile_id}/transfers/{transfer_id}/payments'
        payload = {
            'type': 'BALANCE'
        }
        
        response = requests.post(
            endpoint,
            headers=self._get_headers(),
            json=payload
        )
        response.raise_for_status()
        return response.json()


class MpesaService:
    """Service for handling M-PESA payment operations"""
    def __init__(self):
        self.api_key = settings.MPESA_API_KEY
        self.api_secret = settings.MPESA_API_SECRET
        self.business_shortcode = settings.MPESA_BUSINESS_SHORTCODE
        self.passkey = settings.MPESA_PASSKEY
        
    def _get_access_token(self):
        """Get OAuth access token from Safaricom"""
        endpoint = "https://sandbox.safaricom.co.ke/oauth/v1/generate"
        response = requests.get(
            endpoint,
            auth=(self.api_key, self.api_secret)
        )
        response.raise_for_status()
        return response.json()['access_token']
        
    def initiate_b2c_payment(self, phone_number, amount, remarks):
        """Initiate B2C payment (Business to Customer)"""
        access_token = self._get_access_token()
        endpoint = "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest"
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "InitiatorName": settings.MPESA_INITIATOR_NAME,
            "SecurityCredential": settings.MPESA_SECURITY_CREDENTIAL,
            "CommandID": "BusinessPayment",
            "Amount": str(amount),
            "PartyA": self.business_shortcode,
            "PartyB": phone_number,
            "Remarks": remarks,
            "QueueTimeOutURL": f"{settings.SITE_URL}/api/payments/mpesa-timeout",
            "ResultURL": f"{settings.SITE_URL}/api/payments/mpesa-result",
            "Occasion": ""
        }
        
        response = requests.post(
            endpoint,
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        return response.json()


class PaymentService:
    """Main service for handling all payment operations"""
    
    @staticmethod
    def calculate_platform_fee(amount):
        """Calculate platform fee (10% of the total amount)"""
        return Decimal(amount) * Decimal('0.10')

    @classmethod
    def create_payment_intent(cls, task, client):
        """Create a payment intent for a task"""
        amount = Decimal(task.budget_range.split('$')[-1].replace('>', '').strip())
        platform_fee = cls.calculate_platform_fee(amount)

        # Create PaymentIntent record
        return PaymentIntent.objects.create(
            task=task,
            client=client,
            amount=amount,
            platform_fee=platform_fee,
            currency='USD'  # Default to USD for client payments
        )

    @classmethod
    def process_payment(cls, payment_intent_id):
        """Process the payment using Wise and create M-PESA payout"""
        payment_intent = PaymentIntent.objects.get(id=payment_intent_id)
        wise_service = WiseService()
        mpesa_service = MpesaService()

        try:
            with transaction.atomic():
                # Get expert's M-PESA details
                expert = payment_intent.task.assigned_expert
                payment_method = expert.payment_method

                # Create Wise quote for conversion
                quote = wise_service.create_quote(
                    source_amount=payment_intent.expert_payout_amount
                )
                payment_intent.wise_quote_id = quote['id']

                # Create and fund Wise transfer
                transfer = wise_service.create_transfer(
                    quote['id'],
                    f"{expert.first_name} {expert.last_name}",
                    payment_method.phone_number
                )
                payment_intent.wise_transfer_id = transfer['id']
                wise_service.fund_transfer(transfer['id'])

                # Create M-PESA payout record
                payout = ExpertPayout.objects.create(
                    expert=expert,
                    payment_intent=payment_intent,
                    amount=quote['targetAmount'],
                    currency='KES'
                )

                # Initiate M-PESA B2C payment
                mpesa_result = mpesa_service.initiate_b2c_payment(
                    payment_method.phone_number,
                    int(quote['targetAmount']),  # M-PESA requires integer amounts
                    f"Payment for task: {payment_intent.task.title}"
                )
                
                # Update statuses
                payment_intent.status = 'completed'
                payment_intent.save()
                
                return payment_intent, payout

        except Exception as e:
            # Handle failure
            payment_intent.status = 'failed'
            payment_intent.save()
            raise e