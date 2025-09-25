from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

# ViewSets and APIViews
from tasks.views import TaskViewSet
from payments.views import PaymentIntentViewSet, ExpertPayoutViewSet, create_paypal_order
from messages.views import MessageViewSet, ReviewViewSet
from accounts.views import (
    CurrentUserView,
    UserViewSet,
    ExpertInvitationViewSet,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from ai.views import ChatbotView, PriceSuggestionView
from messages.views import InvoiceListCreateView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='tasks')
router.register(r'payments/intents', PaymentIntentViewSet, basename='payment-intents')
router.register(r'payments/payouts', ExpertPayoutViewSet, basename='expert-payouts')
router.register(r'messages', MessageViewSet, basename='messages')
router.register(r'messages/reviews', ReviewViewSet, basename='reviews')
router.register(r'accounts/users', UserViewSet, basename='users')
router.register(r'accounts/invitations', ExpertInvitationViewSet, basename='expert-invitations')

urlpatterns = [
    path('admin/', admin.site.urls),

    # Router endpoints
    path('api/', include(router.urls)),

    # App includes (legacy and additional endpoints)
    path('api/accounts/', include('accounts.urls')),
    path('api/tasks/', include('tasks.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/messages/', include('messages.urls')),

    # Auth
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/user/', CurrentUserView.as_view(), name='current_user'),

    # AI endpoints (direct + under /api/ai/)
    path('api/chatbot/', ChatbotView.as_view(), name='chatbot_root'),
    path('api/ai/chatbot/', ChatbotView.as_view(), name='chatbot'),
    path('api/ai/price-suggestion/', PriceSuggestionView.as_view(), name='price_suggestion'),

    # Compatibility aliases for existing frontend code
    path('api/admin/chatbot/', ChatbotView.as_view(), name='admin_chatbot'),
    path('api/client/invoices/', InvoiceListCreateView.as_view(), name='client_invoices'),

    # Payments helper endpoint exposed directly
    path('api/payments/paypal/order/create/', create_paypal_order, name='create_paypal_order'),
]
