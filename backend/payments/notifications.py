from django.db import models
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

class PaymentNotification(models.Model):
    """Tracks payment status changes and notifications"""
    EVENT_TYPES = (
        ('payment_created', 'Payment Created'),
        ('payment_processing', 'Payment Processing'),
        ('payment_completed', 'Payment Completed'),
        ('payment_failed', 'Payment Failed'),
        ('payout_initiated', 'Payout Initiated'),
        ('payout_completed', 'Payout Completed'),
        ('payout_failed', 'Payout Failed'),
        ('refund_initiated', 'Refund Initiated'),
        ('refund_completed', 'Refund Completed'),
        ('payment_reminder', 'Payment Reminder'),
    )

    payment_intent = models.ForeignKey(
        'payments.PaymentIntent',
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    message = models.TextField()
    data = models.JSONField(null=True, blank=True)  # Store additional event data
    is_read = models.BooleanField(default=False)
    notification_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_event_type_display()} - {self.payment_intent}"

    def send_notification(self):
        """Send email notification based on event type"""
        if self.notification_sent:
            return

        # Determine recipient based on event type
        if 'payout' in self.event_type:
            recipient = self.payment_intent.task.assigned_expert.email
            template_name = 'payments/email/expert_notification.html'
        else:
            recipient = self.payment_intent.client.email
            template_name = 'payments/email/client_notification.html'

        # Prepare email content
        context = {
            'event_type': self.get_event_type_display(),
            'message': self.message,
            'task_title': self.payment_intent.task.title,
            'amount': self.payment_intent.amount,
            'currency': self.payment_intent.currency,
            'payment_method': self.payment_intent.get_payment_method_display(),
        }

        # Render email template
        html_message = render_to_string(template_name, context)
        plain_message = strip_tags(html_message)

        # Send email
        send_mail(
            subject=f"Payment Update: {self.get_event_type_display()}",
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient],
            html_message=html_message
        )

        self.notification_sent = True
        self.save()


class PaymentStatusLog(models.Model):
    """Detailed payment status change log"""
    payment_intent = models.ForeignKey(
        'payments.PaymentIntent',
        on_delete=models.CASCADE,
        related_name='status_logs'
    )
    previous_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='payment_status_changes'
    )
    notes = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.payment_intent} - {self.previous_status} → {self.new_status}"