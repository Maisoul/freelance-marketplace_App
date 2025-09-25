"""
Views for accounts app
"""
from rest_framework.decorators import action
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import uuid

from .models import User, ExpertInvitation, Notification
from .serializers import (
    ClientRegistrationSerializer, ExpertRegistrationSerializer,
    UserSerializer, ClientProfileSerializer, ExpertProfileSerializer,
    ExpertInvitationSerializer, NotificationSerializer, PasswordChangeSerializer
)

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT serializer to use email instead of username"""
    username_field = 'email'


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom JWT view to use email instead of username"""
    serializer_class = CustomTokenObtainPairSerializer


class CurrentUserView(APIView):
    """Get current authenticated user details"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for User management"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if hasattr(self.request.user, 'is_admin') and self.request.user.is_admin():
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['get'])
    def profile(self, request):
        """Get user profile with extended information"""
        user = request.user
        if hasattr(user, 'is_client') and user.is_client() and hasattr(user, 'client_profile'):
            serializer = ClientProfileSerializer(user.client_profile)
        elif hasattr(user, 'is_expert') and user.is_expert() and hasattr(user, 'expert_profile'):
            serializer = ExpertProfileSerializer(user.expert_profile)
        else:
            serializer = UserSerializer(user)
        return Response(serializer.data)


class ClientRegistrationView(APIView):
    """Client registration endpoint"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ClientRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExpertRegistrationView(APIView):
    """Expert registration via invitation endpoint (token-based)"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ExpertRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExpertInvitationViewSet(viewsets.ModelViewSet):
    """ViewSet for Expert Invitations"""
    queryset = ExpertInvitation.objects.all()
    serializer_class = ExpertInvitationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if hasattr(self.request.user, 'is_admin') and self.request.user.is_admin():
            return ExpertInvitation.objects.all()
        return ExpertInvitation.objects.filter(invited_by=self.request.user)

    def perform_create(self, serializer):
        # Create token and expiry on creation, then send email
        token = uuid.uuid4().hex
        expires = timezone.now() + timedelta(hours=24)
        instance = serializer.save(invited_by=self.request.user, token=token, expires_at=expires)

        invite_url = f"{settings.SITE_URL}/invite/expert/accept?token={instance.token}"
        send_mail(
            subject='Invitation to Join Mai-Guru Platform',
            message=(
                f"You have been invited to join Mai-Guru as an expert in {instance.get_expertise_display()}.\n\n"
                f"Click the link below to accept the invitation (expires in 24 hours):\n{invite_url}\n\n"
                "Best regards,\nMai-Guru Team"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[instance.email],
            fail_silently=False,
        )

    @action(detail=True, methods=['post'])
    def resend(self, request, pk=None):
        instance = self.get_object()
        if instance.is_used:
            return Response({'error': 'Invitation already used'}, status=status.HTTP_400_BAD_REQUEST)
        if instance.is_expired():
            instance.token = uuid.uuid4().hex
            instance.expires_at = timezone.now() + timedelta(hours=24)
            instance.save(update_fields=['token', 'expires_at'])
        invite_url = f"{settings.SITE_URL}/invite/expert/accept?token={instance.token}"
        send_mail(
            subject='Invitation to Join Mai-Guru Platform',
            message=(
                f"You have been invited to join Mai-Guru as an expert in {instance.get_expertise_display()}.\n\n"
                f"Click the link below to accept the invitation (expires in 24 hours):\n{invite_url}\n\n"
                "Best regards,\nMai-Guru Team"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[instance.email],
            fail_silently=False,
        )
        return Response({'message': 'Invitation email sent'})


class ExpertInviteAcceptView(APIView):
    """Accept expert invite using token and set password"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get('token')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')

        if not token or not password:
            return Response({'error': 'Token and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            invitation = ExpertInvitation.objects.get(token=token)
        except ExpertInvitation.DoesNotExist:
            return Response({'error': 'Invalid invitation token'}, status=status.HTTP_400_BAD_REQUEST)

        if not invitation.is_valid():
            return Response({'error': 'Invitation token is expired or already used'}, status=status.HTTP_400_BAD_REQUEST)

        # Create a username from email local part if not provided
        username = invitation.email.split('@')[0]
        base_username = username
        suffix = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{suffix}"
            suffix += 1

        # Create the user account
        user = User.objects.create_user(
            username=username,
            email=invitation.email,
            password=password,
            role='expert',
            first_name=first_name,
            last_name=last_name,
        )

        # Minimal expert profile with default expertise
        from .models import ExpertProfile
        if not hasattr(ExpertProfile, 'EXPERTISE_CHOICES'):
            default_expertise = 'web_development'
        else:
            default_expertise = ExpertProfile.EXPERTISE_CHOICES[0][0]
        ExpertProfile.objects.create(user=user, expertise=default_expertise)

        # Mark invitation as used
        invitation.is_used = True
        invitation.used_at = timezone.now()
        invitation.save(update_fields=['is_used', 'used_at'])

        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class PasswordChangeView(APIView):
    """Change user password"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'message': 'Password changed successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for user notifications"""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'message': 'Notification marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'message': 'All notifications marked as read'})
