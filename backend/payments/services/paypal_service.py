import requests
from decimal import Decimal
from django.conf import settings

class PayPalService:
    """Service for handling PayPal payment operations"""
    def __init__(self):
        self.client_id = settings.PAYPAL_CLIENT_ID
        self.client_secret = settings.PAYPAL_CLIENT_SECRET
        self.base_url = 'https://api-m.sandbox.paypal.com' if settings.PAYPAL_SANDBOX else 'https://api-m.paypal.com'

    def _get_access_token(self):
        """Get OAuth access token from PayPal"""
        auth_url = f"{self.base_url}/v1/oauth2/token"
        headers = {
            "Accept": "application/json",
            "Accept-Language": "en_US"
        }
        data = {"grant_type": "client_credentials"}
        
        response = requests.post(
            auth_url,
            auth=(self.client_id, self.client_secret),
            headers=headers,
            data=data
        )
        response.raise_for_status()
        return response.json()["access_token"]

    def create_order(self, amount, currency='USD', order_items=None):
        """Create a PayPal order"""
        access_token = self._get_access_token()
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }

        payload = {
            "intent": "CAPTURE",
            "purchase_units": [{
                "amount": {
                    "currency_code": currency,
                    "value": str(amount)
                },
                "description": "Freelance Task Payment"
            }]
        }

        if order_items:
            payload["purchase_units"][0]["items"] = order_items

        response = requests.post(
            f"{self.base_url}/v2/checkout/orders",
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        return response.json()

    def capture_payment(self, order_id):
        """Capture an approved PayPal payment"""
        access_token = self._get_access_token()
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }

        response = requests.post(
            f"{self.base_url}/v2/checkout/orders/{order_id}/capture",
            headers=headers
        )
        response.raise_for_status()
        return response.json()

    def create_payout(self, email, amount, currency='USD', note="Task payment"):
        """Create a PayPal payout to an expert"""
        access_token = self._get_access_token()
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }

        payload = {
            "sender_batch_header": {
                "sender_batch_id": f"Batch_{int(time.time())}",
                "email_subject": "You have a payment from the Freelance Platform",
                "email_message": note
            },
            "items": [{
                "recipient_type": "EMAIL",
                "amount": {
                    "value": str(amount),
                    "currency": currency
                },
                "note": note,
                "receiver": email
            }]
        }

        response = requests.post(
            f"{self.base_url}/v1/payments/payouts",
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        return response.json()

    def get_payout_status(self, payout_batch_id):
        """Check the status of a payout"""
        access_token = self._get_access_token()
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }

        response = requests.get(
            f"{self.base_url}/v1/payments/payouts/{payout_batch_id}",
            headers=headers
        )
        response.raise_for_status()
        return response.json()

    def refund_payment(self, capture_id, amount=None, reason=None):
        """Refund a payment partially or fully"""
        access_token = self._get_access_token()
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }

        payload = {}
        if amount:
            payload["amount"] = {
                "value": str(amount),
                "currency_code": "USD"
            }
        if reason:
            payload["note_to_payer"] = reason

        response = requests.post(
            f"{self.base_url}/v2/payments/captures/{capture_id}/refund",
            headers=headers,
            json=payload if payload else None
        )
        response.raise_for_status()
        return response.json()