from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, ClientProfile, ExpertProfile

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        if instance.role == "client":
            ClientProfile.objects.create(user=instance)
        elif instance.role == "expert":
            ExpertProfile.objects.create(user=instance)
