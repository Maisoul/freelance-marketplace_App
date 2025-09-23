from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import PaymentIntent, ExpertPayout, ExpertPaymentMethod
from .serializers import (
    PaymentIntentSerializer,
    ExpertPayoutSerializer,
    ExpertPaymentMethodSerializer,
)
from .services.wise_service import WiseService
from .services.mpesa_service import MPESAService
from .services.paypal_service import PayPalService

class PaymentIntentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentIntentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return PaymentIntent.objects.all()
        return PaymentIntent.objects.filter(client=user)

    @action(detail=True, methods=['post'])
    def create_paypal_order(self, request, pk=None):
        payment_intent = self.get_object()
        if payment_intent.status != 'pending':
            return Response(
                {"error": "Payment intent must be pending"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if request.user != payment_intent.client:
            return Response(
                {"error": "Only the client can process this payment"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            paypal_service = PayPalService()
            order = paypal_service.create_order(
                amount=payment_intent.amount,
                currency=payment_intent.currency
            )
            
            # Store PayPal order ID
            payment_intent.paypal_order_id = order['id']
            payment_intent.save()
            
            return Response({
                "order_id": order['id'],
                "links": order['links']
            })
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def capture_paypal_payment(self, request, pk=None):
        payment_intent = self.get_object()
        
        if request.user != payment_intent.client:
            return Response(
                {"error": "Only the client can process this payment"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            paypal_service = PayPalService()
            capture = paypal_service.capture_payment(payment_intent.paypal_order_id)
            
            # Update payment intent status
            payment_intent.status = 'succeeded'
            payment_intent.paypal_capture_id = capture['purchase_units'][0]['payments']['captures'][0]['id']
            payment_intent.save()
            
            return Response(PaymentIntentSerializer(payment_intent).data)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def process_mpesa_payment(self, request, pk=None):
        payment_intent = self.get_object()
        phone_number = request.data.get('phone_number')
        
        if not phone_number:
            return Response(
                {"error": "Phone number is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if request.user != payment_intent.client:
            return Response(
                {"error": "Only the client can process this payment"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            mpesa_service = MPESAService()
            stk_push = mpesa_service.initiate_stk_push(
                phone_number=phone_number,
                amount=payment_intent.amount,
                reference=str(payment_intent.id)
            )
            
            payment_intent.mpesa_checkout_request_id = stk_push['CheckoutRequestID']
            payment_intent.save()
            
            return Response({
                "checkout_request_id": stk_push['CheckoutRequestID'],
                "merchant_request_id": stk_push['MerchantRequestID']
            })
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def process_wise_payment(self, request, pk=None):
        payment_intent = self.get_object()
        
        if request.user != payment_intent.client:
            return Response(
                {"error": "Only the client can process this payment"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            wise_service = WiseService()
            quote = wise_service.create_quote(
                source_amount=payment_intent.amount,
                source_currency=payment_intent.currency,
                target_currency='USD'  # or get from expert's preference
            )
            
            # Create transfer and get payment methods
            transfer = wise_service.create_transfer(quote['id'])
            payment_methods = wise_service.get_payment_methods(transfer['id'])
            
            payment_intent.wise_transfer_id = transfer['id']
            payment_intent.save()
            
            return Response({
                "transfer_id": transfer['id'],
                "payment_methods": payment_methods
            })
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def refund(self, request, pk=None):
        payment_intent = self.get_object()
        
        if request.user != payment_intent.client and not request.user.is_staff:
            return Response(
                {"error": "Only the client or staff can refund this payment"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            if payment_intent.paypal_capture_id:
                paypal_service = PayPalService()
                refund = paypal_service.refund_payment(payment_intent.paypal_capture_id)
                payment_intent.status = 'refunded'
                payment_intent.save()
            elif payment_intent.wise_transfer_id:
                wise_service = WiseService()
                refund = wise_service.cancel_transfer(payment_intent.wise_transfer_id)
                payment_intent.status = 'refunded'
                payment_intent.save()
            # Add M-PESA refund logic here when supported
            
            return Response(PaymentIntentSerializer(payment_intent).data)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class ExpertPayoutViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ExpertPayoutSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return ExpertPayout.objects.all()
        return ExpertPayout.objects.filter(expert=user)

    @action(detail=True, methods=['post'])
    def process_payout(self, request, pk=None):
        payout = self.get_object()
        
        if not request.user.is_staff:
            return Response(
                {"error": "Only staff can process payouts"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            expert_payment_method = payout.expert.expertpaymentmethod_set.first()
            if not expert_payment_method:
                return Response(
                    {"error": "Expert has no payment method set up"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if expert_payment_method.payment_type == 'wise':
                wise_service = WiseService()
                transfer = wise_service.create_transfer_to_recipient(
                    recipient_id=expert_payment_method.wise_recipient_id,
                    amount=payout.amount,
                    currency=payout.currency
                )
                payout.wise_transfer_id = transfer['id']
                payout.status = 'processing'
                payout.save()
            
            elif expert_payment_method.payment_type == 'paypal':
                paypal_service = PayPalService()
                payout_result = paypal_service.create_payout(
                    email=expert_payment_method.paypal_email,
                    amount=payout.amount,
                    currency=payout.currency
                )
                payout.paypal_payout_id = payout_result['batch_header']['payout_batch_id']
                payout.status = 'processing'
                payout.save()
            
            # Add M-PESA payout logic here
            
            return Response(ExpertPayoutSerializer(payout).data)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class ExpertPaymentMethodViewSet(viewsets.ModelViewSet):
    serializer_class = ExpertPaymentMethodSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ExpertPaymentMethod.objects.filter(expert=self.request.user)

    def perform_create(self, serializer):
        payment_type = self.request.data.get('payment_type')
        
        try:
            if payment_type == 'wise':
                wise_service = WiseService()
                recipient_data = self.request.data.get('wise_recipient_data')
                recipient = wise_service.create_recipient(recipient_data)
                serializer.save(
                    expert=self.request.user,
                    wise_recipient_id=recipient['id']
                )
            
            elif payment_type == 'paypal':
                paypal_email = self.request.data.get('paypal_email')
                if not paypal_email:
                    raise ValueError("PayPal email is required")
                serializer.save(
                    expert=self.request.user,
                    paypal_email=paypal_email
                )
            
            # Add M-PESA payment method logic here
            
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
