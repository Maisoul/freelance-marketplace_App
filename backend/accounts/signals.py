"""
Signals for automatic profile creation
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, ClientProfile, ExpertProfile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Automatically create profile when user is created
    """
    if created:
        if instance.role == 'client':
            ClientProfile.objects.create(user=instance)
        elif instance.role == 'expert':
            ExpertProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Save profile when user is saved
    """
    if instance.role == 'client' and hasattr(instance, 'client_profile'):
        instance.client_profile.save()
    elif instance.role == 'expert' and hasattr(instance, 'expert_profile'):
        instance.expert_profile.save()