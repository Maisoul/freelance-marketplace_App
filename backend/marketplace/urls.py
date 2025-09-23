from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from tasks.views import TaskViewSet
from tasks.views.submission import TaskSubmissionViewSet
from payments.views import (
    PaymentIntentViewSet,
    ExpertPayoutViewSet,
    ExpertPaymentMethodViewSet
)
from accounts.views import (
    UserViewSet,
    ExpertRegistrationView,
    PasswordChangeView,
    CurrentUserView,
    EmailTokenObtainPairView
)
from messages.views import (
    MessageViewSet,
    ReviewViewSet
)
from ai.views import (
    ChatbotView,
    PriceSuggestionView
)

# Create a router instance
router = DefaultRouter()

# Register the viewsets with the router
# Tasks
router.register(r'tasks', TaskViewSet, basename='tasks')
router.register(r'submissions', TaskSubmissionViewSet, basename='submissions')

# Payments
router.register(r'payment-intents', PaymentIntentViewSet, basename='payment-intents')
router.register(r'expert-payouts', ExpertPayoutViewSet, basename='expert-payouts')
router.register(r'expert-payment-methods', ExpertPaymentMethodViewSet, basename='expert-payment-methods')

# Users and Authentication
router.register(r'users', UserViewSet, basename='users')

# Messages and Reviews
router.register(r'messages', MessageViewSet, basename='messages')
router.register(r'reviews', ReviewViewSet, basename='reviews')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),
    
    # Authentication
    path('api/token/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/password/change/', PasswordChangeView.as_view(), name='password_change'),
    path('api/auth/user/', CurrentUserView.as_view(), name='current_user'),
    
    # Expert Registration
    path('api/experts/register/', ExpertRegistrationView.as_view(), name='expert_registration'),
    
    # AI Endpoints
    path('api/chatbot/', ChatbotView.as_view(), name='chatbot'),
    path('api/price-suggestion/', PriceSuggestionView.as_view(), name='price_suggestion'),
    
    # Include the router's URLs
    path('api/', include(router.urls)),
    
    # Include app-specific URLs
    path('api/accounts/', include('accounts.urls')),
    path('api/messages/', include('messages.urls')),
    path('api/payments/', include('payments.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
