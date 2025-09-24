"""
Serializers for payments app
"""
from rest_framework import serializers
from .models import PaymentIntent, ExpertPayout, ExpertPaymentMethod, Refund, Invoice
from tasks.serializers import TaskSerializer
from accounts.serializers import UserSerializer


class PaymentIntentSerializer(serializers.ModelSerializer):
    """Serializer for PaymentIntent"""
    client_name = serializers.CharField(source='client.get_full_name', read_only=True)
    task_title = serializers.CharField(source='task.title', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    
    class Meta:
        model = PaymentIntent
        fields = [
            'id', 'task', 'task_title', 'client', 'client_name', 'amount',
            'currency', 'payment_method', 'payment_method_display', 'status',
            'status_display', 'platform_fee', 'expert_payout_amount',
            'paypal_order_id', 'paypal_capture_id', 'mpesa_checkout_request_id',
            'mpesa_transaction_id', 'wise_transfer_id', 'created_at',
            'updated_at', 'completed_at', 'failure_reason', 'gateway_response'
        ]
        read_only_fields = [
            'id', 'client', 'status', 'platform_fee', 'expert_payout_amount',
            'paypal_order_id', 'paypal_capture_id', 'mpesa_checkout_request_id',
            'mpesa_transaction_id', 'wise_transfer_id', 'created_at',
            'updated_at', 'completed_at', 'failure_reason', 'gateway_response'
        ]


class ExpertPayoutSerializer(serializers.ModelSerializer):
    """Serializer for ExpertPayout"""
    expert_name = serializers.CharField(source='expert.get_full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payout_method_display = serializers.CharField(source='get_payout_method_display', read_only=True)
    
    class Meta:
        model = ExpertPayout
        fields = [
            'id', 'expert', 'expert_name', 'payment_intent', 'amount',
            'currency', 'payout_method', 'payout_method_display', 'status',
            'status_display', 'payout_reference', 'processing_fee',
            'created_at', 'updated_at', 'processed_at', 'failure_reason',
            'gateway_response'
        ]
        read_only_fields = [
            'id', 'expert', 'payment_intent', 'status', 'payout_reference',
            'created_at', 'updated_at', 'processed_at', 'failure_reason',
            'gateway_response'
        ]


class ExpertPaymentMethodSerializer(serializers.ModelSerializer):
    """Serializer for ExpertPaymentMethod"""
    method_type_display = serializers.CharField(source='get_method_type_display', read_only=True)
    
    class Meta:
        model = ExpertPaymentMethod
        fields = [
            'id', 'expert', 'method_type', 'method_type_display', 'is_primary',
            'paypal_email', 'wise_email', 'wise_account_id', 'bank_name',
            'account_number', 'routing_number', 'swift_code', 'is_verified',
            'verified_at', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'expert', 'is_verified', 'verified_at', 'created_at', 'updated_at'
        ]


class RefundSerializer(serializers.ModelSerializer):
    """Serializer for Refund"""
    requested_by_name = serializers.CharField(source='requested_by.get_full_name', read_only=True)
    processed_by_name = serializers.CharField(source='processed_by.get_full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    task_title = serializers.CharField(source='payment_intent.task.title', read_only=True)
    
    class Meta:
        model = Refund
        fields = [
            'id', 'payment_intent', 'task_title', 'requested_by', 'requested_by_name',
            'amount', 'reason', 'status', 'status_display', 'processed_by',
            'processed_by_name', 'refund_reference', 'gateway_response',
            'created_at', 'updated_at', 'processed_at', 'admin_notes',
            'rejection_reason'
        ]
        read_only_fields = [
            'id', 'requested_by', 'status', 'processed_by', 'refund_reference',
            'gateway_response', 'created_at', 'updated_at', 'processed_at'
        ]


class InvoiceSerializer(serializers.ModelSerializer):
    """Serializer for Invoice"""
    client_name = serializers.CharField(source='client.get_full_name', read_only=True)
    task_title = serializers.CharField(source='task.title', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Invoice
        fields = [
            'id', 'task', 'task_title', 'client', 'client_name', 'invoice_number',
            'amount', 'currency', 'status', 'status_display', 'due_date',
            'description', 'line_items', 'payment_intent', 'created_at',
            'updated_at', 'sent_at', 'paid_at'
        ]
        read_only_fields = [
            'id', 'invoice_number', 'status', 'created_at', 'updated_at',
            'sent_at', 'paid_at'
        ]


class PaymentStatsSerializer(serializers.Serializer):
    """Serializer for payment statistics"""
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_payouts = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_platform_fees = serializers.DecimalField(max_digits=10, decimal_places=2)
    pending_payments = serializers.IntegerField()
    completed_payments = serializers.IntegerField()
    failed_payments = serializers.IntegerField()
    pending_refunds = serializers.IntegerField()
    completed_refunds = serializers.IntegerField()