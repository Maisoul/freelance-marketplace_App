from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PaymentIntentViewSet,
    ExpertPayoutViewSet,
    ExpertPaymentMethodViewSet
)

router = DefaultRouter()
router.register(r'payment-intents', PaymentIntentViewSet, basename='payment-intent')
router.register(r'expert-payouts', ExpertPayoutViewSet, basename='expert-payout')
router.register(r'expert-payment-methods', ExpertPaymentMethodViewSet, basename='expert-payment-method')

urlpatterns = [
    path('', include(router.urls)),
]
