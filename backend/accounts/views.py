"""
Views for accounts app
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
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
    UserSerializer, ClientProfileSerializer, ExpertProfileSerializer,
    ClientRegistrationSerializer, ExpertRegistrationSerializer,
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
        if self.request.user.is_admin():
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['get'])
    def profile(self, request):
        """Get user profile with extended information"""
        user = request.user
        if user.is_client():
            serializer = ClientProfileSerializer(user.client_profile)
        elif user.is_expert():
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
            return Response(
                UserSerializer(user).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExpertRegistrationView(APIView):
    """Expert registration via invitation endpoint"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ExpertRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                UserSerializer(user).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExpertInvitationViewSet(viewsets.ModelViewSet):
    """ViewSet for Expert Invitations"""
    queryset = ExpertInvitation.objects.all()
    serializer_class = ExpertInvitationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_admin():
            return ExpertInvitation.objects.all()
        return ExpertInvitation.objects.filter(invited_by=self.request.user)

    def perform_create(self, serializer):
        serializer.save(invited_by=self.request.user)

    @action(detail=True, methods=['post'])
    def send_invitation(self, request, pk=None):
        """Send invitation email to expert"""
        invitation = self.get_object()
        
        # Generate token if not exists
        if not invitation.token:
            invitation.token = str(uuid.uuid4())
            invitation.expires_at = timezone.now() + timedelta(hours=24)
            invitation.save()

        # Send email
        try:
            send_mail(
                subject='Invitation to Join Mai-Guru Platform',
                message=f'''
                You have been invited to join Mai-Guru as an expert in {invitation.get_expertise_display()}.
                
                Click the link below to accept the invitation:
                {settings.SITE_URL}invite/{invitation.token}
                
                This invitation expires in 24 hours.
                
                Best regards,
                Mai-Guru Team
                ''',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[invitation.email],
                fail_silently=False,
            )
            
            return Response({'message': 'Invitation sent successfully'})
        except Exception as e:
            return Response(
                {'error': f'Failed to send invitation: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


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