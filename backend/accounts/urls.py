from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    ClientRegistrationView,
    ExpertRegistrationView,
    PasswordChangeView,
    ExpertInvitationViewSet,  # routed via DRF router in marketplace/urls.py
    ExpertInvitationViewSet,
    CustomTokenObtainPairView,
    ExpertInviteAcceptView,
)

urlpatterns = [
    # JWT token endpoints
    path("auth/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Registration endpoints
    path("register/client/", ClientRegistrationView.as_view(), name="register_client"),
    path("register/expert/", ExpertRegistrationView.as_view(), name="register_expert"),
    path("invite/expert/accept/", ExpertInviteAcceptView.as_view(), name="invite_expert_accept"),

    # Password management
    path("password/change/", PasswordChangeView.as_view(), name="password_change"),
]

