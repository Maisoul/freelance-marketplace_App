"""
Payment models for Mai-Guru platform
"""
from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
from accounts.models import User
from tasks.models import Task


class PaymentIntent(models.Model):
    """
    Payment intent for client payments
    """
    PAYMENT_METHOD_CHOICES = [
        ('paypal', 'PayPal'),
        ('mpesa', 'M-Pesa Global'),
        ('wise', 'Wise'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]
    
    # Basic Information
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='payments')
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_intents')
    
    # Payment Details
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    currency = models.CharField(max_length=3, default='USD')
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    
    # Platform Fees
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    expert_payout_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Payment Gateway References
    paypal_order_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    paypal_capture_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    mpesa_checkout_request_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    mpesa_transaction_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    wise_transfer_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Additional Information
    failure_reason = models.TextField(blank=True)
    gateway_response = models.JSONField(default=dict, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Payment for {self.task.title} - ${self.amount}"
    
    @property
    def status_display(self):
        return dict(self.STATUS_CHOICES)[self.status]
    
    def calculate_platform_fee(self):
        """Calculate 10% platform fee"""
        self.platform_fee = self.amount * 0.10
        self.expert_payout_amount = self.amount - self.platform_fee
        return self.platform_fee


class ExpertPayout(models.Model):
    """
    Payouts to experts
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    PAYOUT_METHOD_CHOICES = [
        ('paypal', 'PayPal'),
        ('wise', 'Wise'),
        ('bank_transfer', 'Bank Transfer'),
    ]
    
    expert = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payouts')
    payment_intent = models.OneToOneField(PaymentIntent, on_delete=models.CASCADE, related_name='expert_payout')
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    currency = models.CharField(max_length=3, default='USD')
    payout_method = models.CharField(max_length=15, choices=PAYOUT_METHOD_CHOICES)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    
    # Payout Details
    payout_reference = models.CharField(max_length=255, unique=True, null=True, blank=True)
    processing_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    # Additional Information
    failure_reason = models.TextField(blank=True)
    gateway_response = models.JSONField(default=dict, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Payout to {self.expert.username} - ${self.amount}"


class ExpertPaymentMethod(models.Model):
    """
    Expert payment method preferences
    """
    PAYMENT_METHOD_CHOICES = [
        ('paypal', 'PayPal'),
        ('wise', 'Wise'),
        ('bank_transfer', 'Bank Transfer'),
    ]
    
    expert = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_methods')
    method_type = models.CharField(max_length=15, choices=PAYMENT_METHOD_CHOICES)
    is_primary = models.BooleanField(default=False)
    
    # PayPal Details
    paypal_email = models.EmailField(blank=True)
    
    # Wise Details
    wise_email = models.EmailField(blank=True)
    wise_account_id = models.CharField(max_length=255, blank=True)
    
    # Bank Transfer Details
    bank_name = models.CharField(max_length=100, blank=True)
    account_number = models.CharField(max_length=50, blank=True)
    routing_number = models.CharField(max_length=50, blank=True)
    swift_code = models.CharField(max_length=20, blank=True)
    
    # Verification
    is_verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['expert', 'method_type']
    
    def __str__(self):
        return f"{self.expert.username} - {self.get_method_type_display()}"
    
    def clean(self):
        from django.core.exceptions import ValidationError
        
        if self.method_type == 'paypal' and not self.paypal_email:
            raise ValidationError('PayPal email is required for PayPal method')
        
        if self.method_type == 'wise' and not self.wise_email:
            raise ValidationError('Wise email is required for Wise method')
        
        if self.method_type == 'bank_transfer':
            required_fields = ['bank_name', 'account_number']
            for field in required_fields:
                if not getattr(self, field):
                    raise ValidationError(f'{field} is required for bank transfer method')


class Refund(models.Model):
    """
    Refund requests and processing
    """
    STATUS_CHOICES = [
        ('requested', 'Requested'),
        ('approved', 'Approved'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    ]
    
    payment_intent = models.ForeignKey(PaymentIntent, on_delete=models.CASCADE, related_name='refunds')
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='refund_requests')
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    reason = models.TextField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='requested')
    
    # Processing Details
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='processed_refunds')
    refund_reference = models.CharField(max_length=255, unique=True, null=True, blank=True)
    gateway_response = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    # Additional Information
    admin_notes = models.TextField(blank=True)
    rejection_reason = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Refund for {self.payment_intent.task.title} - ${self.amount}"


class Invoice(models.Model):
    """
    Invoice generation and tracking
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
        ('cancelled', 'Cancelled'),
    ]
    
    task = models.OneToOneField(Task, on_delete=models.CASCADE, related_name='invoice')
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invoices')
    invoice_number = models.CharField(max_length=50, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='draft')
    
    # Invoice Details
    due_date = models.DateTimeField()
    description = models.TextField()
    line_items = models.JSONField(default=list, blank=True)
    
    # Payment Information
    payment_intent = models.OneToOneField(PaymentIntent, on_delete=models.SET_NULL, null=True, blank=True, related_name='invoice')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.task.title}"
    
    def generate_invoice_number(self):
        """Generate unique invoice number"""
        import uuid
        return f"MG-{timezone.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
    
    def save(self, *args, **kwargs):
        if not self.invoice_number:
            self.invoice_number = self.generate_invoice_number()
        super().save(*args, **kwargs)