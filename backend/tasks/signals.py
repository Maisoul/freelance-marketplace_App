from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from .models import Task
from payments.models import Invoice


def budget_to_amount(budget_range: str) -> float:
    mapping = {
        'less_100': 75,
        '100_500': 300,
        '501_1000': 750,
        '1001_2000': 1500,
        'above_2000': 2500,
    }
    return float(mapping.get(budget_range, 300))


@receiver(post_save, sender=Task)
def create_invoice_on_completion(sender, instance: Task, created, **kwargs):
    # Only act on updates (not creates)
    if created:
        return

    # Generate invoice when a task transitions to completed and no invoice exists
    if instance.status == 'completed' and not hasattr(instance, 'invoice'):
        amount = instance.final_price or instance.estimated_price or instance.ai_suggested_price or budget_to_amount(instance.budget_range)
        due_date = instance.deadline if instance.deadline else timezone.now() + timezone.timedelta(days=7)

        Invoice.objects.create(
            task=instance,
            client=instance.client,
            amount=amount,
            currency='USD',
            status='sent',
            due_date=due_date,
            description=f"Invoice for task '{instance.title}'",
            line_items=[{"description": instance.title, "amount": float(amount)}],
        )
