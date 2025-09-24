"""
AI services for Mai-Guru platform
"""
import openai
import requests
from bs4 import BeautifulSoup
from django.conf import settings
from django.core.cache import cache
from django.utils import timezone
import json
import logging
from typing import Dict, List, Optional, Tuple
from .models import ChatSession, ChatMessage, PriceSuggestion, WebScrapingData, AIUsageLog

logger = logging.getLogger(__name__)


class OpenAIService:
    """Service for OpenAI API interactions"""
    
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
    
    def get_chat_response(self, messages: List[Dict], session_type: str = 'general') -> Tuple[str, int]:
        """
        Get response from OpenAI chat completion
        
        Args:
            messages: List of message dictionaries
            session_type: Type of chat session for context
            
        Returns:
            Tuple of (response_text, tokens_used)
        """
        try:
            system_prompts = {
                'client_support': "You are a helpful customer support assistant for Mai-Guru, an AI-powered freelance platform. Help clients with their questions about projects, payments, and platform features. Be professional, friendly, and informative.",
                'pricing_negotiation': "You are a pricing negotiation assistant for Mai-Guru. Help clients understand fair pricing for their projects based on market rates and project complexity. Be transparent about pricing factors.",
                'post_project': "You are a post-project support assistant for Mai-Guru. Help clients with project completion, reviews, and any follow-up questions. Focus on ensuring client satisfaction.",
                'general_inquiry': "You are a general assistant for Mai-Guru, an AI-powered freelance platform. Help users with general questions about the platform, services, and how to get started."
            }
            
            system_message = {
                "role": "system",
                "content": system_prompts.get(session_type, system_prompts['general_inquiry'])
            }
            
            # Add system message at the beginning
            full_messages = [system_message] + messages
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=full_messages,
                max_tokens=500,
                temperature=0.7
            )
            
            response_text = response.choices[0].message.content
            tokens_used = response.usage.total_tokens
            
            return response_text, tokens_used
            
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            return "I apologize, but I'm having trouble processing your request. Please try again later.", 0


class WebScrapingService:
    """Service for web scraping market data"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
    
    def scrape_fiverr_prices(self, category: str, service_type: str) -> List[Dict]:
        """
        Scrape pricing data from Fiverr
        
        Args:
            category: Service category
            service_type: Specific service type
            
        Returns:
            List of pricing data dictionaries
        """
        try:
            # This is a simplified example - actual implementation would need proper scraping
            # with respect to robots.txt and terms of service
            cache_key = f"fiverr_prices_{category}_{service_type}"
            cached_data = cache.get(cache_key)
            
            if cached_data:
                return cached_data
            
            # Mock data for demonstration - replace with actual scraping logic
            mock_data = [
                {'price': 25, 'title': f'{service_type} Service', 'rating': 4.8},
                {'price': 50, 'title': f'Premium {service_type}', 'rating': 4.9},
                {'price': 100, 'title': f'Expert {service_type}', 'rating': 5.0},
            ]
            
            # Cache for 1 hour
            cache.set(cache_key, mock_data, 3600)
            
            return mock_data
            
        except Exception as e:
            logger.error(f"Fiverr scraping error: {str(e)}")
            return []
    
    def scrape_upwork_prices(self, category: str, service_type: str) -> List[Dict]:
        """
        Scrape pricing data from Upwork
        
        Args:
            category: Service category
            service_type: Specific service type
            
        Returns:
            List of pricing data dictionaries
        """
        try:
            cache_key = f"upwork_prices_{category}_{service_type}"
            cached_data = cache.get(cache_key)
            
            if cached_data:
                return cached_data
            
            # Mock data for demonstration
            mock_data = [
                {'price': 30, 'title': f'{service_type} Project', 'rating': 4.7},
                {'price': 75, 'title': f'Advanced {service_type}', 'rating': 4.8},
                {'price': 150, 'title': f'Expert {service_type}', 'rating': 4.9},
            ]
            
            cache.set(cache_key, mock_data, 3600)
            
            return mock_data
            
        except Exception as e:
            logger.error(f"Upwork scraping error: {str(e)}")
            return []
    
    def get_market_data(self, category: str, service_type: str) -> Dict:
        """
        Get aggregated market data from multiple platforms
        
        Args:
            category: Service category
            service_type: Specific service type
            
        Returns:
            Dictionary with aggregated market data
        """
        fiverr_data = self.scrape_fiverr_prices(category, service_type)
        upwork_data = self.scrape_upwork_prices(category, service_type)
        
        all_prices = []
        all_prices.extend([item['price'] for item in fiverr_data])
        all_prices.extend([item['price'] for item in upwork_data])
        
        if not all_prices:
            return {
                'min_price': 0,
                'max_price': 0,
                'average_price': 0,
                'data_points': 0,
                'platforms': []
            }
        
        return {
            'min_price': min(all_prices),
            'max_price': max(all_prices),
            'average_price': sum(all_prices) / len(all_prices),
            'data_points': len(all_prices),
            'platforms': [
                {'name': 'Fiverr', 'data': fiverr_data},
                {'name': 'Upwork', 'data': upwork_data}
            ]
        }


class PriceSuggestionService:
    """Service for AI-powered price suggestions"""
    
    def __init__(self):
        self.openai_service = OpenAIService()
        self.scraping_service = WebScrapingService()
    
    def suggest_price(self, task) -> Dict:
        """
        Generate AI-powered price suggestion for a task
        
        Args:
            task: Task instance
            
        Returns:
            Dictionary with price suggestion and reasoning
        """
        try:
            # Get market data
            market_data = self.scraping_service.get_market_data(task.category, task.complexity)
            
            # Prepare prompt for AI
            prompt = f"""
            Based on the following task details and market data, suggest an appropriate price:
            
            Task Details:
            - Category: {task.get_category_display()}
            - Complexity: {task.get_complexity_display()}
            - Description: {task.description[:500]}...
            - Budget Range: {task.get_budget_range_display()}
            
            Market Data:
            - Average Market Price: ${market_data['average_price']:.2f}
            - Price Range: ${market_data['min_price']:.2f} - ${market_data['max_price']:.2f}
            - Data Points: {market_data['data_points']}
            
            Please provide:
            1. Suggested price (just the number)
            2. Confidence score (0.0 to 1.0)
            3. Reasoning for the price suggestion
            
            Format your response as JSON:
            {{
                "suggested_price": number,
                "confidence_score": number,
                "reasoning": "detailed explanation"
            }}
            """
            
            messages = [{"role": "user", "content": prompt}]
            response, tokens_used = self.openai_service.get_chat_response(messages, 'pricing_negotiation')
            
            # Parse AI response
            try:
                ai_data = json.loads(response)
                suggested_price = float(ai_data['suggested_price'])
                confidence_score = float(ai_data['confidence_score'])
                reasoning = ai_data['reasoning']
            except (json.JSONDecodeError, KeyError, ValueError):
                # Fallback to market average if AI response is invalid
                suggested_price = market_data['average_price']
                confidence_score = 0.5
                reasoning = "Price based on market average due to AI response parsing error"
            
            # Create price suggestion record
            price_suggestion = PriceSuggestion.objects.create(
                task=task,
                suggested_price=suggested_price,
                confidence_score=confidence_score,
                reasoning=reasoning,
                market_data=market_data
            )
            
            # Log AI usage
            AIUsageLog.objects.create(
                user=task.client,
                service_type='price_suggestion',
                tokens_used=tokens_used,
                request_data={'task_id': task.id, 'category': task.category},
                response_data={'suggested_price': suggested_price, 'confidence_score': confidence_score}
            )
            
            return {
                'success': True,
                'suggested_price': suggested_price,
                'confidence_score': confidence_score,
                'reasoning': reasoning,
                'market_data': market_data
            }
            
        except Exception as e:
            logger.error(f"Price suggestion error: {str(e)}")
            return {
                'success': False,
                'error': f"Error generating price suggestion: {str(e)}"
            }


class ChatbotService:
    """Service for AI chatbot interactions"""
    
    def __init__(self):
        self.openai_service = OpenAIService()
    
    def process_message(self, session: ChatSession, message: str, user: User) -> Dict:
        """
        Process a user message and return AI response
        
        Args:
            session: Chat session instance
            message: User message
            user: User instance
            
        Returns:
            Dictionary with response and metadata
        """
        try:
            # Get recent messages from session
            recent_messages = ChatMessage.objects.filter(session=session).order_by('-timestamp')[:10]
            
            # Convert to OpenAI format
            messages = []
            for msg in reversed(recent_messages):
                messages.append({
                    'role': msg.role,
                    'content': msg.content
                })
            
            # Add current user message
            messages.append({
                'role': 'user',
                'content': message
            })
            
            # Get AI response
            response, tokens_used = self.openai_service.get_chat_response(
                messages, session.session_type
            )
            
            # Save user message
            user_message = ChatMessage.objects.create(
                session=session,
                role='user',
                content=message,
                tokens_used=0
            )
            
            # Save AI response
            ai_message = ChatMessage.objects.create(
                session=session,
                role='assistant',
                content=response,
                tokens_used=tokens_used
            )
            
            # Log AI usage
            AIUsageLog.objects.create(
                user=user,
                service_type='chatbot',
                tokens_used=tokens_used,
                request_data={'session_id': session.session_id, 'message_length': len(message)},
                response_data={'response_length': len(response)}
            )
            
            return {
                'success': True,
                'response': response,
                'tokens_used': tokens_used,
                'message_id': ai_message.id
            }
            
        except Exception as e:
            logger.error(f"Chatbot error: {str(e)}")
            return {
                'success': False,
                'error': f"Error processing message: {str(e)}"
            }
    
    def create_session(self, user: User, session_type: str, task: Task = None) -> ChatSession:
        """
        Create a new chat session
        
        Args:
            user: User instance
            session_type: Type of chat session
            task: Optional task instance
            
        Returns:
            ChatSession instance
        """
        import uuid
        
        session = ChatSession.objects.create(
            user=user,
            task=task,
            session_type=session_type,
            session_id=str(uuid.uuid4())
        )
        
        return session
