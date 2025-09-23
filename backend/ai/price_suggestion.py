import os
import openai
from bs4 import BeautifulSoup
import requests
import json
from django.conf import settings
from django.core.cache import cache

class PriceSuggestionService:
    """Service for providing price suggestions for tasks"""
    
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
        
    def _get_cached_market_data(self, category):
        """Get cached market rate data or fetch new if expired"""
        cache_key = f"market_rates_{category}"
        market_data = cache.get(cache_key)
        
        if market_data is None:
            market_data = self._fetch_market_rates(category)
            cache.set(cache_key, market_data, timeout=86400)  # Cache for 24 hours
            
        return market_data
        
    def _fetch_market_rates(self, category):
        """
        Fetch current market rates from popular freelance platforms
        In production, implement proper web scraping with rate limiting
        """
        # Placeholder market rate data
        sample_rates = {
            "writing": {
                "simple": {"min": 30, "max": 50},
                "moderate": {"min": 50, "max": 100},
                "complex": {"min": 100, "max": 200}
            },
            "dev": {
                "simple": {"min": 100, "max": 200},
                "moderate": {"min": 200, "max": 500},
                "complex": {"min": 500, "max": 1500}
            },
            "design": {
                "simple": {"min": 50, "max": 100},
                "moderate": {"min": 100, "max": 300},
                "complex": {"min": 300, "max": 800}
            },
            "security": {
                "simple": {"min": 200, "max": 500},
                "moderate": {"min": 500, "max": 1000},
                "complex": {"min": 1000, "max": 3000}
            }
        }
        
        return sample_rates.get(category, {
            "simple": {"min": 50, "max": 100},
            "moderate": {"min": 100, "max": 300},
            "complex": {"min": 300, "max": 1000}
        })

    def _analyze_description(self, description):
        """
        Use AI to analyze task description for complexity factors
        Returns a complexity score between 0 and 1
        """
        try:
            prompt = f"""Analyze this task description and rate its complexity on a scale from 0 to 1:
            "{description}"
            Consider:
            1. Technical complexity
            2. Time requirement
            3. Skill level needed
            4. Dependencies and integrations
            Return only a number between 0 and 1."""
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a task complexity analyzer."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=50
            )
            
            complexity_score = float(response.choices[0].message['content'].strip())
            return min(max(complexity_score, 0), 1)  # Ensure score is between 0 and 1
            
        except Exception as e:
            # Log the error in production
            return 0.5  # Default to medium complexity
            
    def suggest_price(self, task_details):
        """
        Generate a price suggestion based on task details and market rates
        
        Args:
            task_details (dict): Contains category, complexity, description
            
        Returns:
            dict: Price suggestion with explanation
        """
        try:
            category = task_details.get('category', 'writing')
            complexity = task_details.get('complexity', 'moderate')
            description = task_details.get('description', '')
            
            # Get base rates for the category
            market_rates = self._get_cached_market_data(category)
            base_range = market_rates[complexity]
            
            # Analyze description for additional complexity factors
            complexity_score = self._analyze_description(description)
            
            # Adjust prices based on complexity score
            price_range = {
                "min": base_range["min"] * (1 + complexity_score * 0.2),
                "max": base_range["max"] * (1 + complexity_score * 0.2)
            }
            
            # Generate explanation using AI
            prompt = f"""Given a task with:
            - Category: {category}
            - Base complexity: {complexity}
            - Additional complexity score: {complexity_score}
            - Price range: ${price_range['min']:.2f} - ${price_range['max']:.2f}
            
            Provide a brief, professional explanation for this price range in 2-3 sentences."""
            
            explanation_response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a professional pricing consultant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=100
            )
            
            return {
                "success": True,
                "data": {
                    "min_price": round(price_range["min"], 2),
                    "max_price": round(price_range["max"], 2),
                    "currency": "USD",
                    "explanation": explanation_response.choices[0].message['content'].strip(),
                    "complexity_factors": {
                        "base_complexity": complexity,
                        "additional_complexity_score": round(complexity_score, 2)
                    }
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Error generating price suggestion: {str(e)}"
            }
