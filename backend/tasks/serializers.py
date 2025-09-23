from rest_framework import serializers
from .models import Task
from .models.submission import TaskSubmission
from accounts.serializers import UserSerializer
from django.utils.timesince import timesince
from django.utils import timezone
from django.conf import settings

class TaskSerializer(serializers.ModelSerializer):
    client = UserSerializer(read_only=True)
    time_to_deadline = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = "__all__"

    def validate(self, data):
        # Ensure required fields are present
        required_fields = ["category", "deadline", "description", "complexity", "budget_range"]
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: f"{field} is required."})
        
        # Deadline must be in the future
        if "deadline" in data and data["deadline"] <= timezone.now():
            raise serializers.ValidationError({"deadline": "Deadline must be in the future."})
        
        # Validate attached file if present
        attached_file = data.get('attached_file')
        if attached_file:
            if not hasattr(attached_file, 'content_type'):
                raise serializers.ValidationError({"attached_file": "Invalid file upload"})
            
            # Validate file size
            if attached_file.size > settings.MAX_UPLOAD_SIZE:
                max_size_mb = settings.MAX_UPLOAD_SIZE / (1024 * 1024)
                raise serializers.ValidationError(
                    {"attached_file": f"File size must not exceed {max_size_mb}MB"}
                )
            
            # Validate content type
            if attached_file.content_type not in settings.CONTENT_TYPES:
                raise serializers.ValidationError(
                    {"attached_file": "File type not allowed"}
                )
        
        return data

    def get_time_to_deadline(self, obj):
        now = timezone.now()
        if obj.deadline < now:
            return "Overdue"
        delta = obj.deadline - now
        days = delta.days
        hours = delta.seconds // 3600
        weeks = days // 7
        if weeks >= 1:
            return f"{weeks} week(s), {days % 7} day(s)"
        if days >= 1:
            return f"{days} day(s), {hours} hour(s)"
            return f"{hours} hour(s)"


class TaskSubmissionSerializer(serializers.ModelSerializer):
    expert = UserSerializer(read_only=True)
    status = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = TaskSubmission
        fields = ['id', 'task', 'expert', 'submission_file', 'description', 
                 'status', 'feedback', 'created_at', 'updated_at']
        read_only_fields = ['expert', 'status', 'feedback']

    def validate_task(self, task):
        """
        Validate that:
        1. The task is open for submissions
        2. The expert is assigned to this task
        3. The expert hasn't already submitted (unless revision requested)
        """
        request = self.context.get('request')
        if not request or not request.user:
            raise serializers.ValidationError("Authentication required")

        # Check if task is open for submissions
        if task.status not in ['in_progress', 'revision_needed']:
            raise serializers.ValidationError(
                "This task is not currently accepting submissions"
            )

        # Check if the expert is assigned to this task
        if request.user != task.assigned_expert:
            raise serializers.ValidationError(
                "You are not assigned to this task"
            )

        # Check for existing submissions (unless revision requested)
        if task.status != 'revision_needed':
            existing_submission = TaskSubmission.objects.filter(
                task=task,
                expert=request.user,
                status__in=['pending', 'accepted']
            ).exists()
            if existing_submission:
                raise serializers.ValidationError(
                    "You have already submitted work for this task"
                )

        return task

    def create(self, validated_data):
        # Set the expert to the current user
        validated_data['expert'] = self.context['request'].user
        return super().create(validated_data)