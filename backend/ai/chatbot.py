import os
import openai
from django.conf import settings

class AIBotService:
    """Service for handling AI chatbot interactions"""
    
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
        self.context = {
            "role": "system",
            "content": """You are a helpful AI assistant for a freelance marketplace platform. 
            You can assist with:
            1. Task pricing suggestions
            2. Understanding task requirements
            3. Platform usage questions
            4. General guidance on freelancing
            
            Always be professional and courteous. If asked about prices, provide ranges 
            based on complexity and market rates. For technical questions, be specific 
            but understandable."""
        }

    def get_chatbot_response(self, message, user_type='client'):
        """
        Get AI response using OpenAI's API
        
        Args:
            message (str): User's message
            user_type (str): 'client' or 'expert' or 'admin'
        
        Returns:
            str: AI's response
        """
        try:
            messages = [
                self.context,
                {"role": "user", "content": message}
            ]
            
            if user_type in ['expert', 'admin']:
                messages[0]["content"] += """
                For experts and admins, provide more technical and detailed responses.
                Include specific tools, frameworks, and methodologies when relevant.
                """
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=0.7,
                max_tokens=150,
                top_p=1.0,
                frequency_penalty=0.0,
                presence_penalty=0.0
            )
            
            return response.choices[0].message['content']
        except Exception as e:
            # Log the error in production
            return f"I apologize, but I'm having trouble processing your request. Please try again later. Error: {str(e)}"

    def suggest_price(self, task_details):
        """
        Suggest a price range for a task based on its details
        
        Args:
            task_details (dict): Contains task category, complexity, description, etc.
        
        Returns:
            dict: Suggested price range and explanation
        """
        try:
            prompt = f"""Given the following task details:
            Category: {task_details.get('category', 'Not specified')}
            Complexity: {task_details.get('complexity', 'Not specified')}
            Description: {task_details.get('description', 'Not specified')}
            
            Suggest a price range and provide a brief explanation. Format your response as JSON:
            {{
                "min_price": number,
                "max_price": number,
                "currency": "USD",
                "explanation": "your explanation here"
            }}"""
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a pricing expert for freelance tasks."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=200
            )
            
            # In production, properly parse the JSON response
            return {
                "success": True,
                "data": response.choices[0].message['content']
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
