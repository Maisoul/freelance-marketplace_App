"""
URL configuration for Mai-Guru marketplace project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import (
    UserViewSet,
    ExpertRegistrationView,
    PasswordChangeView,
    CurrentUserView,
    CustomTokenObtainPairView,
    ExpertInvitationViewSet,
    ClientRegistrationView,
)
from tasks.views import TaskViewSet
from payments.views import PaymentIntentViewSet, ExpertPayoutViewSet, ExpertPaymentMethodViewSet
from messages.views import MessageViewSet, ReviewViewSet, InvoiceViewSet
from ai.views import ChatSessionViewSet, PriceSuggestionView

# Create router for API endpoints
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'payment-intents', PaymentIntentViewSet)
router.register(r'expert-payouts', ExpertPayoutViewSet)
router.register(r'expert-payment-methods', ExpertPaymentMethodViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'expert-invitations', ExpertInvitationViewSet)
router.register(r'chat-sessions', ChatSessionViewSet)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API Authentication
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/user/', CurrentUserView.as_view(), name='current_user'),
    path('api/auth/password-change/', PasswordChangeView.as_view(), name='password_change'),
    
    # API Registration
    path('api/accounts/register/client/', ClientRegistrationView.as_view(), name='client_register'),
    path('api/accounts/register/expert/', ExpertRegistrationView.as_view(), name='expert_register'),
    
    # API Router
    path('api/', include(router.urls)),
    
    # AI Endpoints
    path('api/ai/price-suggestion/', PriceSuggestionView.as_view(), name='price_suggestion'),
    
    # App-specific URLs
    path('api/accounts/', include('accounts.urls')),
    path('api/messages/', include('messages.urls')),
    path('api/payments/', include('payments.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)