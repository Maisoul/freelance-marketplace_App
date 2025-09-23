from django.contrib import admin
from .models import User, ClientProfile, ExpertProfile

admin.site.register(User)
admin.site.register(ClientProfile)
admin.site.register(ExpertProfile)

# Register messaging, reviews, and invoices if imported
try:
	from messages.models import Message
	from messages.reviews import Review
	from messages.invoices import Invoice
	admin.site.register(Message)
	admin.site.register(Review)
	admin.site.register(Invoice)
except ImportError:
	pass
