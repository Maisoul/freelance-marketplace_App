# This file marks the directory as a Python package.

from .chatbot import AIBotService
from .price_suggestion import PriceSuggestionService

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

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
