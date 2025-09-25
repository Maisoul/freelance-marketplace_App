"""
Message and communication models for Mai-Guru platform
"""
from django.db import models
from django.utils import timezone
from accounts.models import User
from tasks.models import Task
from payments.models import Invoice  # use unified Invoice model from payments app


class Message(models.Model):
    """
    General messaging system between users
    """
    MESSAGE_TYPES = [
        ('general', 'General'),
        ('task_related', 'Task Related'),
        ('support', 'Support'),
        ('notification', 'Notification'),
    ]
    
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    subject = models.CharField(max_length=200, blank=True)
    content = models.TextField()
    message_type = models.CharField(max_length=15, choices=MESSAGE_TYPES, default='general')
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Optional task reference
    task = models.ForeignKey(Task, on_delete=models.CASCADE, null=True, blank=True, related_name='messages')
    
    # Message threading
    parent_message = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Message from {self.sender.username} to {self.recipient.username}"
    
    def mark_as_read(self):
        """Mark message as read"""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])


class Review(models.Model):
    """
    Client reviews for completed tasks
    """
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='reviews')
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_reviews')
    expert = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_reviews')
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['task', 'client']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Review for {self.task.title} - {self.rating} stars"


# Removed duplicate Invoice model. Use payments.models.Invoice instead.