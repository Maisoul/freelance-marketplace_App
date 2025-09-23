from django.db import models
from django.conf import settings
from ..validators import validate_task_file

class TaskSubmission(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending Review'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('revision', 'Needs Revision')
    )

    task = models.ForeignKey('tasks.Task', on_delete=models.CASCADE, related_name='submissions')
    expert = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='task_submissions')
    submission_file = models.FileField(
        upload_to='submissions/files/',
        validators=[validate_task_file],
        help_text='Upload your completed work (max 10MB). Allowed: PDF, DOC, DOCX, TXT, PNG, JPG, ZIP'
    )
    description = models.TextField(
        help_text='Describe your submission and any important notes for the client'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    feedback = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"Submission for {self.task.title} by {self.expert.username}"