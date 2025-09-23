# messages/serializers.py
from rest_framework import serializers
from .models import Message
from .reviews import Review
from .invoices import Invoice

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

    def validate(self, data):
        if not data.get('content'):
            raise serializers.ValidationError({'content': 'Message content is required.'})
        if data.get('sender') == data.get('recipient'):
            raise serializers.ValidationError({'recipient': 'Sender and recipient cannot be the same.'})
        return data

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

    def validate(self, data):
        if not (1 <= data.get('rating', 0) <= 5):
            raise serializers.ValidationError({'rating': 'Rating must be between 1 and 5.'})
        if data.get('reviewer') == data.get('expert'):
            raise serializers.ValidationError({'expert': 'Reviewer and expert cannot be the same.'})
        return data

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'

    def validate(self, data):
        if data.get('amount', 0) <= 0:
            raise serializers.ValidationError({'amount': 'Amount must be positive.'})
        if data.get('due_date') and data['due_date'] <= data.get('created_at', None):
            raise serializers.ValidationError({'due_date': 'Due date must be after invoice creation.'})
        return data
