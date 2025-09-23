from django.db import models
from django.conf import settings
from tasks.models import Task

class Message(models.Model):
    """
    Represents a message exchanged between users (client, expert, or admin) about a specific task.
    """
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField(help_text="Message content.")
    timestamp = models.DateTimeField(auto_now_add=True, help_text="Time the message was sent.")
    is_read = models.BooleanField(default=False, help_text="Whether the message has been read.")

    class Meta:
        ordering = ['-timestamp']
        verbose_name = "Message"
        verbose_name_plural = "Messages"

    def __str__(self):
        return f"Message from {self.sender} to {self.recipient} about Task {self.task.id}"
