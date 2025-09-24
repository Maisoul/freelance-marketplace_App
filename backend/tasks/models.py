"""
Task and Project models for Mai-Guru platform
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from accounts.models import User


class Task(models.Model):
    """
    Main task/project model
    """
    CATEGORY_CHOICES = [
        ('web_development', 'Web Development'),
        ('ai_ml', 'AI & Machine Learning'),
        ('cybersecurity', 'Cybersecurity'),
        ('technical_writing', 'Technical Writing'),
        ('design', 'Design & Creative'),
    ]
    
    COMPLEXITY_CHOICES = [
        ('simple', 'Simple'),
        ('moderate', 'Moderate'),
        ('complex', 'Complex'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('assigned', 'Assigned'),
        ('in_progress', 'In Progress'),
        ('review', 'Under Review'),
        ('revision_needed', 'Revision Needed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    BUDGET_RANGE_CHOICES = [
        ('less_100', 'Less than $100'),
        ('100_500', '$100 - $500'),
        ('501_1000', '$501 - $1000'),
        ('1001_2000', '$1001 - $2000'),
        ('above_2000', 'Above $2000'),
    ]
    
    # Basic Information
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    complexity = models.CharField(max_length=10, choices=COMPLEXITY_CHOICES)
    budget_range = models.CharField(max_length=15, choices=BUDGET_RANGE_CHOICES)
    deadline = models.DateTimeField()
    
    # User Information
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='client_tasks')
    assigned_expert = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='expert_tasks')
    
    # Status and Progress
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    progress_percentage = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    # Pricing and Payment
    estimated_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    final_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    ai_suggested_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    assigned_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Additional Information
    additional_comments = models.TextField(blank=True)
    client_requirements = models.JSONField(default=dict, blank=True)
    expert_notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.client.username}"
    
    def is_overdue(self):
        return self.deadline < timezone.now() and self.status not in ['completed', 'cancelled']
    
    def time_to_deadline(self):
        if self.status in ['completed', 'cancelled']:
            return None
        delta = self.deadline - timezone.now()
        if delta.total_seconds() < 0:
            return "Overdue"
        return delta
    
    def can_be_completed(self):
        return self.status in ['in_progress', 'assigned', 'review', 'revision_needed']
    
    def complete(self):
        """Mark task as completed"""
        if not self.can_be_completed():
            raise ValueError("Task cannot be completed in current status")
        self.status = 'completed'
        self.completed_at = timezone.now()
        self.progress_percentage = 100
        self.save(update_fields=['status', 'completed_at', 'progress_percentage', 'updated_at'])


class TaskFile(models.Model):
    """
    File attachments for tasks
    """
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to='task_files/%Y/%m/%d/')
    original_filename = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField()
    file_type = models.CharField(max_length=100)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=200, blank=True)
    
    def __str__(self):
        return f"{self.original_filename} - {self.task.title}"


class TaskSubmission(models.Model):
    """
    Expert submissions for tasks
    """
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='submissions')
    expert = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    submission_text = models.TextField()
    submission_files = models.JSONField(default=list, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_submissions')
    feedback = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-submitted_at']
    
    def __str__(self):
        return f"Submission for {self.task.title} by {self.expert.username}"


class TaskMessage(models.Model):
    """
    Messages between clients and experts for tasks
    """
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    sent_at = models.DateTimeField(auto_now_add=True)
    message_type = models.CharField(max_length=20, choices=[
        ('general', 'General'),
        ('question', 'Question'),
        ('update', 'Update'),
        ('feedback', 'Feedback'),
        ('urgent', 'Urgent'),
    ], default='general')
    
    class Meta:
        ordering = ['sent_at']
    
    def __str__(self):
        return f"Message from {self.sender.username} to {self.recipient.username}"


class TaskReview(models.Model):
    """
    Client reviews for completed tasks
    """
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='reviews')
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_reviews')
    expert = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_reviews')
    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['task', 'client']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Review for {self.task.title} - {self.rating} stars"


class TaskDispute(models.Model):
    """
    Dispute resolution for tasks
    """
    DISPUTE_STATUS_CHOICES = [
        ('open', 'Open'),
        ('under_review', 'Under Review'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='disputes')
    raised_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='raised_disputes')
    dispute_type = models.CharField(max_length=20, choices=[
        ('quality', 'Quality Issue'),
        ('deadline', 'Deadline Issue'),
        ('communication', 'Communication Issue'),
        ('payment', 'Payment Issue'),
        ('other', 'Other'),
    ])
    description = models.TextField()
    status = models.CharField(max_length=15, choices=DISPUTE_STATUS_CHOICES, default='open')
    resolution = models.TextField(blank=True)
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_disputes')
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Dispute for {self.task.title} - {self.get_dispute_type_display()}"