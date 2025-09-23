from django.db import models
from django.conf import settings
from tasks.models import Task

class Invoice(models.Model):
    """
    Represents an invoice for a task, issued to a client.
    """
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='invoices')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='invoices')
    amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Invoice amount.")
    status = models.CharField(max_length=20, choices=(('pending','Pending'),('paid','Paid')), default='pending', help_text="Invoice status.")
    created_at = models.DateTimeField(auto_now_add=True, help_text="Time the invoice was created.")
    due_date = models.DateTimeField(help_text="Invoice due date.")

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Invoice"
        verbose_name_plural = "Invoices"

    def __str__(self):
        return f"Invoice for {self.client} on Task {self.task.id}"
