from django.urls import path
from .views import ChatbotView, PriceSuggestionView

urlpatterns = [
    path('chatbot/', ChatbotView.as_view(), name='ai_chatbot'),
    path('price-suggestion/', PriceSuggestionView.as_view(), name='ai_price_suggestion'),
]