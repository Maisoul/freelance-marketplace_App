from rest_framework import serializers
from .models import PaymentIntent, ExpertPayout, ExpertPaymentMethod
from tasks.serializers import TaskSerializer

class PaymentIntentSerializer(serializers.ModelSerializer):
    task = TaskSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    expert_payout_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = PaymentIntent
        fields = [
            'id', 'task', 'client', 'amount', 'currency', 'platform_fee',
            'status', 'status_display', 'expert_payout_amount',
            'payment_method', 'wise_transfer_id', 'mpesa_checkout_request_id',
            'paypal_order_id', 'paypal_capture_id', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'client', 'amount', 'currency', 'platform_fee', 'status',
            'wise_transfer_id', 'mpesa_checkout_request_id',
            'paypal_order_id', 'paypal_capture_id'
        ]


class ExpertPayoutSerializer(serializers.ModelSerializer):
    payment_intent = PaymentIntentSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = ExpertPayout
        fields = [
            'id', 'expert', 'payment_intent', 'amount', 'currency',
            'status', 'status_display', 'wise_transfer_id',
            'paypal_payout_id', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'expert', 'payment_intent', 'amount', 'currency', 'status',
            'wise_transfer_id', 'paypal_payout_id'
        ]


class ExpertPaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpertPaymentMethod
        fields = [
            'id', 'expert', 'payment_type',
            'wise_recipient_id', 'paypal_email',
            'mpesa_phone_number', 'is_verified',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'expert', 'wise_recipient_id', 'is_verified'
        ]
        extra_kwargs = {
            'paypal_email': {'write_only': True},
            'mpesa_phone_number': {'write_only': True}
        }

    def validate(self, data):
        payment_type = data.get('payment_type')
        
        if payment_type == 'paypal' and not data.get('paypal_email'):
            raise serializers.ValidationError({
                'paypal_email': 'PayPal email is required for PayPal payment method'
            })
        
        elif payment_type == 'mpesa' and not data.get('mpesa_phone_number'):
            raise serializers.ValidationError({
                'mpesa_phone_number': 'Phone number is required for M-PESA payment method'
            })
        
        return data
