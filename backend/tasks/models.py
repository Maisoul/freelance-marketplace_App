from django.db import models
from django.conf import settings
from django.utils import timezone
from django.db import transaction
from .validators import validate_task_file
from payments.services import PaymentService

class Task(models.Model):
    USER_TYPE = (("student", "Student"), ("organization", "Organization"))
    COMPLEXITY = (("simple","Simple"),("moderate","Moderate"),("complex","Complex"))
    BUDGET = (("low","< $50"),("mid","$50-$200"),("high",">$200"))
    CATEGORY = (("writing","Writing"),("dev","Development"),("design","Design"),("security","Security"))
    STATUS_CHOICES = (
        ('open', 'Open'),             # Task is available for experts to take
        ('assigned', 'Assigned'),      # Expert has been assigned
        ('in_progress', 'In Progress'), # Expert has started working
        ('revision_needed', 'Revision Needed'),  # Client requested changes
        ('completed', 'Completed'),    # Task has been completed and accepted
        ('cancelled', 'Cancelled')     # Task has been cancelled
    )

    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="tasks")
    title = models.CharField(max_length=255, blank=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPE)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    contact_phone = models.CharField(max_length=20)
    category = models.CharField(max_length=50, choices=CATEGORY)
    deadline = models.DateTimeField()
    description = models.TextField()
    additional_comments = models.TextField(blank=True)
    complexity = models.CharField(max_length=20, choices=COMPLEXITY)
    budget_range = models.CharField(max_length=20, choices=BUDGET)
    attached_file = models.FileField(
        upload_to="tasks/files/",
        blank=True,
        null=True,
        validators=[validate_task_file],
        help_text="Upload files (max 10MB). Allowed: PDF, DOC, DOCX, TXT, PNG, JPG, ZIP"
    )
    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default='open'
    )
    assigned_expert = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='assigned_tasks',
        null=True,
        blank=True
    )
    assigned_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        
    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"
        
    def assign_expert(self, expert):
        """Assign an expert to this task"""
        if self.status != 'open':
            raise ValueError("Can only assign experts to open tasks")
        
        self.assigned_expert = expert
        self.status = 'assigned'
        self.assigned_at = timezone.now()
        self.save()
        
    def start_work(self):
        """Mark task as in progress"""
        if self.status != 'assigned':
            raise ValueError("Can only start work on assigned tasks")
        
        self.status = 'in_progress'
        self.save()
        
    def request_revision(self):
        """Mark task as needing revision"""
        if self.status not in ['in_progress', 'completed']:
            raise ValueError("Can only request revision for in-progress or completed tasks")
        
        self.status = 'revision_needed'
        self.save()
        
    def complete(self):
        """Mark task as completed"""
        if self.status not in ['in_progress', 'assigned', 'revision_needed']:
            raise ValueError("Can only complete tasks that are assigned, in progress, or in revision")
        self.status = 'completed'
        self.save(update_fields=['status', 'updated_at'])
        if self.status not in ['in_progress', 'revision_needed']:
            raise ValueError("Can only complete tasks that are in progress or need revision")
        
        self.status = 'completed'
        self.save()
        
    def cancel(self):
        """Cancel the task"""
        if self.status == 'completed':
            raise ValueError("Cannot cancel completed tasks")
        
        self.status = 'cancelled'
        self.save()
