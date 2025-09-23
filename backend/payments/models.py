from django.db import models
from django.conf import settings
from decimal import Decimal

class PaymentIntent(models.Model):
    """Represents a payment intent for a task"""
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
        ('cancelled', 'Cancelled')
    )
    
    PAYMENT_METHOD_CHOICES = (
        ('wise', 'Wise Transfer'),
        ('paypal', 'PayPal'),
        ('mpesa', 'M-PESA')
    )

    task = models.OneToOneField('tasks.Task', on_delete=models.PROTECT, related_name='payment_intent')
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='payment_intents')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')  # Source currency
    
    # Payment method specific fields
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHOD_CHOICES)
    
    # Wise specific fields
    wise_transfer_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    wise_quote_id = models.CharField(max_length=255, null=True, blank=True)
    
    # PayPal specific fields
    paypal_order_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    paypal_capture_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    
    # M-PESA specific fields
    mpesa_checkout_request_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    mpesa_payment_ref = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def expert_payout_amount(self):
        """Calculate expert payout amount after platform fee"""
        return self.amount - self.platform_fee

    def __str__(self):
        return f"Payment for {self.task.title} - {self.get_status_display()}"


class ExpertPayout(models.Model):
    """Represents a payout to an expert via any supported payment method"""
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    )

    expert = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='payouts'
    )
    payment_intent = models.OneToOneField(
        PaymentIntent,
        on_delete=models.PROTECT,
        related_name='expert_payout'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    
    # Payment method used for this payout
    payment_method = models.ForeignKey(
        ExpertPaymentMethod,
        on_delete=models.PROTECT,
        related_name='payouts'
    )
    
    # Wise specific fields
    wise_transfer_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    
    # PayPal specific fields
    paypal_payout_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    paypal_payout_batch_id = models.CharField(max_length=255, null=True, blank=True)
    
    # M-PESA specific fields
    mpesa_transaction_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payout to {self.expert.username} for {self.payment_intent.task.title}"


class ExpertPaymentMethod(models.Model):
    """Stores expert's payment information for all supported payment methods"""
    PAYMENT_TYPE_CHOICES = (
        ('wise', 'Wise Transfer'),
        ('paypal', 'PayPal'),
        ('mpesa', 'M-PESA')
    )
    
    expert = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payment_methods'
    )
    payment_type = models.CharField(max_length=10, choices=PAYMENT_TYPE_CHOICES)
    
    # Wise specific fields
    wise_recipient_id = models.CharField(max_length=255, null=True, blank=True)
    
    # PayPal specific fields
    paypal_email = models.EmailField(null=True, blank=True)
    
    # M-PESA specific fields
    mpesa_phone_number = models.CharField(
        max_length=15,
        null=True,
        blank=True,
        help_text='M-PESA registered phone number (format: 254XXXXXXXXX)'
    )
    
    is_verified = models.BooleanField(default=False)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [['expert', 'payment_type']]

    def save(self, *args, **kwargs):
        # If this is the first payment method for the expert, make it primary
        if not self.pk and not self.expert.payment_methods.exists():
            self.is_primary = True
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.expert.username}'s {self.get_payment_type_display()} payment method"
        return f"M-PESA account for {self.expert.username}"

    def clean(self):
        """Validate phone number format"""
        import re
        if not re.match(r'^254\d{9}$', self.phone_number):
            raise ValidationError({
                'phone_number': 'Phone number must be in format: 254XXXXXXXXX'
            })
