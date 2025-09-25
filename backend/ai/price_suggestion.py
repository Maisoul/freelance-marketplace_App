from django.core.cache import cache

CATEGORY_MAP = {
    'web_development': {
        'simple': (100, 200),
        'moderate': (200, 500),
        'complex': (500, 1500),
    },
    'ai_ml': {
        'simple': (300, 600),
        'moderate': (600, 1200),
        'complex': (1200, 3000),
    },
    'cybersecurity': {
        'simple': (200, 500),
        'moderate': (500, 1000),
        'complex': (1000, 3000),
    },
    'writing': {
        'simple': (30, 50),
        'moderate': (50, 100),
        'complex': (100, 200),
    },
}

DEFAULT_RANGE = {
    'simple': (50, 100),
    'moderate': (100, 300),
    'complex': (300, 1000),
}


class PriceSuggestionService:
    """MVP price suggestion using a lookup table with optional caching"""

    def suggest(self, category: str, complexity: str):
        category = (category or '').lower()
        complexity = (complexity or 'moderate').lower()
        mapping = CATEGORY_MAP.get(category, DEFAULT_RANGE)
        low, high = mapping.get(complexity, DEFAULT_RANGE['moderate'])
        return {
            'min_price': float(low),
            'max_price': float(high),
            'currency': 'USD',
            'basis': 'lookup_table_mvp'
        }

    def cached_suggest(self, category: str, complexity: str):
        key = f"price_suggestion:{category}:{complexity}"
        data = cache.get(key)
        if data is None:
            data = self.suggest(category, complexity)
            cache.set(key, data, timeout=3600)
        return data
