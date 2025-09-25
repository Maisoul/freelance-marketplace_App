"""
User models for Mai-Guru platform
"""
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
from django.utils import timezone


class User(AbstractUser):
    """
    Custom User model with role-based access control
    """
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('client', 'Client'),
        ('expert', 'Expert'),
    ]
    
    USER_TYPE_CHOICES = [
        ('student', 'Student'),
        ('organization', 'Organization'),
    ]
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client')
    user_type = models.CharField(max_length=15, choices=USER_TYPE_CHOICES, default='student')
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def is_client(self):
        return self.role == 'client'
    
    def is_expert(self):
        return self.role == 'expert'
    
    def is_admin(self):
        return self.role == 'admin'
    
    def __str__(self):
        return f"{self.username} ({self.role})"


class ClientProfile(models.Model):
    """
    Extended profile for client users with type-specific fields
    """
    ORGANIZATION_SIZES = (
        ('1-50', '1-50 staff'),
        ('51-100', '51-100 staff'),
        ('101-500', '101-500 staff'),
        ('500+', '500+ staff'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    country = models.CharField(max_length=100, blank=True)

    # Student-specific
    student_id = models.CharField(max_length=50, blank=True)
    institution = models.CharField(max_length=200, blank=True)

    # Organization-specific
    company_name = models.CharField(max_length=200, blank=True)
    company_email = models.EmailField(blank=True)
    company_size = models.CharField(max_length=20, choices=ORGANIZATION_SIZES, blank=True)
    company_domain = models.CharField(max_length=100, blank=True)

    # Legacy/optional fields retained for compatibility
    contact_person = models.CharField(max_length=100, blank=True)
    budget_preference = models.CharField(max_length=50, blank=True)
    preferred_communication = models.CharField(max_length=20, choices=[
        ('email', 'Email'),
        ('phone', 'Phone'),
        ('chat', 'Chat'),
    ], default='email')

    def __str__(self):
        return f"{self.user.username} - Client Profile"


class ExpertProfile(models.Model):
    """
    Extended profile for expert users
    """
    EXPERTISE_CHOICES = [
        ('web_development', 'Web Development'),
        ('ai_ml', 'AI & Machine Learning'),
        ('cybersecurity', 'Cybersecurity'),
        ('technical_writing', 'Technical Writing'),
        ('design', 'Design & Creative'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='expert_profile')
    expertise = models.CharField(max_length=50, choices=EXPERTISE_CHOICES)
    bio = models.TextField(blank=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    availability = models.BooleanField(default=True)
    portfolio_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    years_experience = models.PositiveIntegerField(default=0)
    skills = models.JSONField(default=list, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_projects = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return f"{self.user.username} - {self.get_expertise_display()}"


class ExpertInvitation(models.Model):
    """
    Model for expert invitations with token-based registration
    """
    email = models.EmailField()
    token = models.CharField(max_length=100, unique=True)
    expertise = models.CharField(max_length=50, choices=ExpertProfile.EXPERTISE_CHOICES)
    invited_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_invitations')
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    used_at = models.DateTimeField(null=True, blank=True)
    
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    def is_valid(self):
        return not self.is_used and not self.is_expired()
    
    def __str__(self):
        return f"Invitation for {self.email} - {self.get_expertise_display()}"


class UserActivity(models.Model):
    """
    Track user activities for analytics and security
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(max_length=100)
    details = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.action}"


class Notification(models.Model):
    """
    System notifications for users
    """
    NOTIFICATION_TYPES = [
        ('task_assigned', 'Task Assigned'),
        ('task_completed', 'Task Completed'),
        ('payment_received', 'Payment Received'),
        ('expert_invited', 'Expert Invited'),
        ('message_received', 'Message Received'),
        ('system_update', 'System Update'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    related_object_id = models.PositiveIntegerField(null=True, blank=True)
    related_object_type = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"