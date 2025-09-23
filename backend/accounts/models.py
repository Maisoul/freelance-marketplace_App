from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("client", "Client"),
        ("expert", "Expert"),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="client")
    # other shared fields can be added here
    def is_client(self):
        return self.role == "client"
    def is_expert(self):
        return self.role == "expert"

class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="client_profile")
    country = models.CharField(max_length=100, blank=True)
    user_type = models.CharField(max_length=20, choices=(("student","Student"),("org","Organization")), default="student")
    company_name = models.CharField(max_length=200, blank=True)
    contact = models.CharField(max_length=50, blank=True)

class ExpertProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="expert_profile")
    expertise = models.CharField(max_length=200)
    bio = models.TextField(blank=True)
