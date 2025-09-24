"""
Serializers for messages app
"""
from rest_framework import serializers
from .models import Message, Review, Invoice
from tasks.serializers import TaskSerializer
from accounts.serializers import UserSerializer


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for Message"""
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    recipient_name = serializers.CharField(source='recipient.get_full_name', read_only=True)
    message_type_display = serializers.CharField(source='get_message_type_display', read_only=True)
    task_title = serializers.CharField(source='task.title', read_only=True)
    
    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'sender_name', 'recipient', 'recipient_name',
            'subject', 'content', 'message_type', 'message_type_display',
            'is_read', 'read_at', 'created_at', 'task', 'task_title',
            'parent_message'
        ]
        read_only_fields = [
            'id', 'sender', 'is_read', 'read_at', 'created_at'
        ]


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for Review"""
    client_name = serializers.CharField(source='client.get_full_name', read_only=True)
    expert_name = serializers.CharField(source='expert.get_full_name', read_only=True)
    task_title = serializers.CharField(source='task.title', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 'task', 'task_title', 'client', 'client_name', 'expert',
            'expert_name', 'rating', 'comment', 'is_public', 'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id', 'client', 'expert', 'created_at', 'updated_at'
        ]


class InvoiceSerializer(serializers.ModelSerializer):
    """Serializer for Invoice"""
    client_name = serializers.CharField(source='client.get_full_name', read_only=True)
    task_title = serializers.CharField(source='task.title', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Invoice
        fields = [
            'id', 'task', 'task_title', 'client', 'client_name', 'invoice_number',
            'amount', 'currency', 'status', 'status_display', 'due_date',
            'description', 'line_items', 'payment_intent', 'created_at',
            'updated_at', 'sent_at', 'paid_at'
        ]
        read_only_fields = [
            'id', 'invoice_number', 'status', 'created_at', 'updated_at',
            'sent_at', 'paid_at'
        ]


class MessageStatsSerializer(serializers.Serializer):
    """Serializer for message statistics"""
    total_messages = serializers.IntegerField()
    unread_messages = serializers.IntegerField()
    total_reviews = serializers.IntegerField()
    average_rating = serializers.DecimalField(max_digits=3, decimal_places=2)
    total_invoices = serializers.IntegerField()
    pending_invoices = serializers.IntegerField()
    paid_invoices = serializers.IntegerField()