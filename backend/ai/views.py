# This file marks the directory as a Python package.

from .chatbot import AIBotService
from .price_suggestion import PriceSuggestionService

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatbotView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        message = request.data.get('message', '')
        user_type = request.data.get('user_type', 'client')
        ai_service = AIBotService()
        response = ai_service.get_chatbot_response(message, user_type)
        return Response({'response': response})

class PriceSuggestionView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        category = request.data.get('category', 'dev')
        complexity = request.data.get('complexity', 'simple')
        price_service = PriceSuggestionService()
        suggestion = price_service._get_cached_market_data(category)
        return Response({'suggestion': suggestion.get(complexity, {})})

# ViewSets for the main URLs
class ChatSessionViewSet(viewsets.ModelViewSet):
    """ViewSet for chat sessions"""
    queryset = User.objects.none()  # Empty queryset for now
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        return Response({'message': 'Chat sessions endpoint'})
    
    def create(self, request):
        message = request.data.get('message', '')
        user_type = request.data.get('user_type', 'client')
        ai_service = AIBotService()
        response = ai_service.get_chatbot_response(message, user_type)
        return Response({'response': response})
