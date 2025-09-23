from django.db import models
from django.conf import settings
from tasks.models import Task

class Review(models.Model):
    """
    Represents a review left by a client for an expert on a specific task.
    """
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='given_reviews')
    expert = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_reviews')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(help_text="Rating from 1 to 5.")
    comment = models.TextField(blank=True, help_text="Optional review comment.")
    created_at = models.DateTimeField(auto_now_add=True, help_text="Time the review was created.")

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Review"
        verbose_name_plural = "Reviews"

    def __str__(self):
        return f"Review by {self.reviewer} for {self.expert} on Task {self.task.id}"
