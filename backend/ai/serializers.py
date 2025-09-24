"""
Serializers for AI app
"""
from rest_framework import serializers
from .models import ChatSession, ChatMessage, PriceSuggestion, WebScrapingData, AIUsageLog
from tasks.serializers import TaskSerializer
from accounts.serializers import UserSerializer


class ChatMessageSerializer(serializers.ModelSerializer):
    """Serializer for ChatMessage"""
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    
    class Meta:
        model = ChatMessage
        fields = [
            'id', 'session', 'role', 'role_display', 'content', 'timestamp',
            'tokens_used', 'response_time'
        ]
        read_only_fields = ['id', 'timestamp']


class ChatSessionSerializer(serializers.ModelSerializer):
    """Serializer for ChatSession"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    session_type_display = serializers.CharField(source='get_session_type_display', read_only=True)
    task_title = serializers.CharField(source='task.title', read_only=True)
    messages = ChatMessageSerializer(many=True, read_only=True)
    message_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatSession
        fields = [
            'id', 'user', 'user_name', 'task', 'task_title', 'session_type',
            'session_type_display', 'session_id', 'is_active', 'messages',
            'message_count', 'created_at', 'updated_at', 'ended_at'
        ]
        read_only_fields = [
            'id', 'session_id', 'created_at', 'updated_at', 'ended_at'
        ]
    
    def get_message_count(self, obj):
        return obj.messages.count()


class PriceSuggestionSerializer(serializers.ModelSerializer):
    """Serializer for PriceSuggestion"""
    task_title = serializers.CharField(source='task.title', read_only=True)
    confidence_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = PriceSuggestion
        fields = [
            'id', 'task', 'task_title', 'suggested_price', 'confidence_score',
            'confidence_percentage', 'reasoning', 'market_data', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_confidence_percentage(self, obj):
        return round(obj.confidence_score * 100, 1)


class WebScrapingDataSerializer(serializers.ModelSerializer):
    """Serializer for WebScrapingData"""
    platform_display = serializers.CharField(source='get_platform_display', read_only=True)
    
    class Meta:
        model = WebScrapingData
        fields = [
            'id', 'platform', 'platform_display', 'category', 'service_type',
            'price_range_min', 'price_range_max', 'average_price', 'data_points',
            'scraped_at', 'raw_data'
        ]
        read_only_fields = ['id', 'scraped_at']


class AIUsageLogSerializer(serializers.ModelSerializer):
    """Serializer for AIUsageLog"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    service_type_display = serializers.CharField(source='get_service_type_display', read_only=True)
    
    class Meta:
        model = AIUsageLog
        fields = [
            'id', 'user', 'user_name', 'service_type', 'service_type_display',
            'tokens_used', 'cost', 'request_data', 'response_data', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class ChatRequestSerializer(serializers.Serializer):
    """Serializer for chat requests"""
    message = serializers.CharField()
    session_type = serializers.ChoiceField(choices=ChatSession.SESSION_TYPES)
    task_id = serializers.IntegerField(required=False, allow_null=True)


class PriceSuggestionRequestSerializer(serializers.Serializer):
    """Serializer for price suggestion requests"""
    task_id = serializers.IntegerField()
    force_refresh = serializers.BooleanField(default=False)


class AIStatsSerializer(serializers.Serializer):
    """Serializer for AI usage statistics"""
    total_chat_sessions = serializers.IntegerField()
    total_messages = serializers.IntegerField()
    total_price_suggestions = serializers.IntegerField()
    total_tokens_used = serializers.IntegerField()
    total_cost = serializers.DecimalField(max_digits=10, decimal_places=4)
    average_confidence_score = serializers.DecimalField(max_digits=3, decimal_places=2)
