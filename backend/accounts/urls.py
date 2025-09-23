from django.urls import path
from .views import ClientRegisterView, ExpertRegisterView, AdminPasswordChangeView, ExpertInviteView, ExpertInviteAcceptView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/client/", ClientRegisterView.as_view(), name="register_client"),
    path("register/expert/", ExpertRegisterView.as_view(), name="register_expert"),
    path("admin/change-password/", AdminPasswordChangeView.as_view(), name="admin_change_password"),
    path("invite/expert/", ExpertInviteView.as_view(), name="invite_expert"),
    path("invite/expert/accept/", ExpertInviteAcceptView.as_view(), name="invite_expert_accept"),
]
