"""
Serializers for tasks app
"""
from rest_framework import serializers
from .models import Task, TaskFile, TaskSubmission, TaskMessage, TaskReview, TaskDispute
from accounts.serializers import UserSerializer


class TaskFileSerializer(serializers.ModelSerializer):
    """Serializer for TaskFile"""
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    
    class Meta:
        model = TaskFile
        fields = [
            'id', 'file', 'original_filename', 'file_size', 'file_type',
            'uploaded_by_name', 'uploaded_at', 'description'
        ]
        read_only_fields = ['id', 'uploaded_by', 'uploaded_at']


class TaskSerializer(serializers.ModelSerializer):
    """Serializer for Task"""
    client_name = serializers.CharField(source='client.get_full_name', read_only=True)
    assigned_expert_name = serializers.CharField(source='assigned_expert.get_full_name', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    complexity_display = serializers.CharField(source='get_complexity_display', read_only=True)
    budget_range_display = serializers.CharField(source='get_budget_range_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    time_to_deadline = serializers.SerializerMethodField()
    is_overdue = serializers.BooleanField(read_only=True)
    files = TaskFileSerializer(many=True, read_only=True)
    
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'category', 'category_display',
            'complexity', 'complexity_display', 'budget_range', 'budget_range_display',
            'deadline', 'client', 'client_name', 'assigned_expert', 'assigned_expert_name',
            'status', 'status_display', 'progress_percentage', 'estimated_price',
            'final_price', 'ai_suggested_price', 'additional_comments',
            'client_requirements', 'expert_notes', 'time_to_deadline', 'is_overdue',
            'created_at', 'updated_at', 'assigned_at', 'completed_at', 'files'
        ]
        read_only_fields = [
            'id', 'client', 'assigned_expert', 'status', 'progress_percentage',
            'created_at', 'updated_at', 'assigned_at', 'completed_at'
        ]
    
    def get_time_to_deadline(self, obj):
        return obj.time_to_deadline()


class TaskCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating tasks"""
    
    class Meta:
        model = Task
        fields = [
            'title', 'description', 'category', 'complexity', 'budget_range',
            'deadline', 'additional_comments', 'client_requirements'
        ]
    
    def create(self, validated_data):
        validated_data['client'] = self.context['request'].user
        return super().create(validated_data)


class TaskSubmissionSerializer(serializers.ModelSerializer):
    """Serializer for TaskSubmission"""
    expert_name = serializers.CharField(source='expert.get_full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)
    
    class Meta:
        model = TaskSubmission
        fields = [
            'id', 'task', 'expert', 'expert_name', 'submission_text',
            'submission_files', 'submitted_at', 'is_approved', 'approved_at',
            'approved_by', 'approved_by_name', 'feedback'
        ]
        read_only_fields = [
            'id', 'expert', 'submitted_at', 'is_approved', 'approved_at',
            'approved_by'
        ]


class TaskMessageSerializer(serializers.ModelSerializer):
    """Serializer for TaskMessage"""
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    recipient_name = serializers.CharField(source='recipient.get_full_name', read_only=True)
    message_type_display = serializers.CharField(source='get_message_type_display', read_only=True)
    
    class Meta:
        model = TaskMessage
        fields = [
            'id', 'task', 'sender', 'sender_name', 'recipient', 'recipient_name',
            'message', 'is_read', 'sent_at', 'message_type', 'message_type_display'
        ]
        read_only_fields = ['id', 'sender', 'sent_at']


class TaskReviewSerializer(serializers.ModelSerializer):
    """Serializer for TaskReview"""
    client_name = serializers.CharField(source='client.get_full_name', read_only=True)
    expert_name = serializers.CharField(source='expert.get_full_name', read_only=True)
    
    class Meta:
        model = TaskReview
        fields = [
            'id', 'task', 'client', 'client_name', 'expert', 'expert_name',
            'rating', 'comment', 'created_at'
        ]
        read_only_fields = ['id', 'client', 'expert', 'created_at']


class TaskDisputeSerializer(serializers.ModelSerializer):
    """Serializer for TaskDispute"""
    raised_by_name = serializers.CharField(source='raised_by.get_full_name', read_only=True)
    resolved_by_name = serializers.CharField(source='resolved_by.get_full_name', read_only=True)
    dispute_type_display = serializers.CharField(source='get_dispute_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = TaskDispute
        fields = [
            'id', 'task', 'raised_by', 'raised_by_name', 'dispute_type',
            'dispute_type_display', 'description', 'status', 'status_display',
            'resolution', 'resolved_by', 'resolved_by_name', 'created_at',
            'resolved_at', 'admin_notes', 'rejection_reason'
        ]
        read_only_fields = [
            'id', 'raised_by', 'status', 'resolved_by', 'created_at',
            'resolved_at'
        ]


class TaskStatsSerializer(serializers.Serializer):
    """Serializer for task statistics"""
    total_tasks = serializers.IntegerField()
    pending_tasks = serializers.IntegerField()
    in_progress_tasks = serializers.IntegerField()
    completed_tasks = serializers.IntegerField()
    overdue_tasks = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    average_rating = serializers.DecimalField(max_digits=3, decimal_places=2)