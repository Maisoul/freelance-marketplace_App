"""
AI-related models for Mai-Guru platform
"""
from django.db import models
from django.utils import timezone
from accounts.models import User
from tasks.models import Task


class ChatSession(models.Model):
    """
    AI Chat sessions for different purposes
    """
    SESSION_TYPES = [
        ('client_support', 'Client Support'),
        ('pricing_negotiation', 'Pricing Negotiation'),
        ('post_project', 'Post-Project Support'),
        ('general_inquiry', 'General Inquiry'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_sessions')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, null=True, blank=True, related_name='chat_sessions')
    session_type = models.CharField(max_length=20, choices=SESSION_TYPES)
    session_id = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Chat Session - {self.user.username} - {self.get_session_type_display()}"


class ChatMessage(models.Model):
    """
    Individual messages in AI chat sessions
    """
    MESSAGE_ROLES = [
        ('user', 'User'),
        ('assistant', 'AI Assistant'),
        ('system', 'System'),
    ]
    
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=10, choices=MESSAGE_ROLES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    tokens_used = models.PositiveIntegerField(default=0)
    response_time = models.FloatField(default=0.0)  # in seconds
    
    class Meta:
        ordering = ['timestamp']
    
    def __str__(self):
        return f"{self.role} message in session {self.session.session_id}"


class PriceSuggestion(models.Model):
    """
    AI-generated price suggestions for tasks
    """
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='price_suggestions')
    suggested_price = models.DecimalField(max_digits=10, decimal_places=2)
    confidence_score = models.FloatField()  # 0.0 to 1.0
    reasoning = models.TextField()
    market_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Price suggestion for {self.task.title} - ${self.suggested_price}"


class WebScrapingData(models.Model):
    """
    Market data scraped from various platforms
    """
    PLATFORM_CHOICES = [
        ('fiverr', 'Fiverr'),
        ('upwork', 'Upwork'),
        ('freelancer', 'Freelancer'),
        ('guru', 'Guru'),
        ('toptal', 'Toptal'),
    ]
    
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    category = models.CharField(max_length=50)
    service_type = models.CharField(max_length=100)
    price_range_min = models.DecimalField(max_digits=10, decimal_places=2)
    price_range_max = models.DecimalField(max_digits=10, decimal_places=2)
    average_price = models.DecimalField(max_digits=10, decimal_places=2)
    data_points = models.PositiveIntegerField()
    scraped_at = models.DateTimeField(auto_now_add=True)
    raw_data = models.JSONField(default=dict, blank=True)
    
    class Meta:
        ordering = ['-scraped_at']
        unique_together = ['platform', 'category', 'service_type', 'scraped_at']
    
    def __str__(self):
        return f"{self.platform} - {self.category} - ${self.average_price}"


class AIUsageLog(models.Model):
    """
    Log AI API usage for monitoring and billing
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_usage_logs')
    service_type = models.CharField(max_length=20, choices=[
        ('chatbot', 'Chatbot'),
        ('price_suggestion', 'Price Suggestion'),
        ('web_scraping', 'Web Scraping'),
    ])
    tokens_used = models.PositiveIntegerField()
    cost = models.DecimalField(max_digits=10, decimal_places=4, default=0.00)
    request_data = models.JSONField(default=dict, blank=True)
    response_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.service_type} - {self.tokens_used} tokens"
