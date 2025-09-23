from rest_framework import generics, permissions, viewsets
from .serializers import ClientRegisterSerializer, ExpertRegisterSerializer, UserSerializer
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.http import JsonResponse
from .invite_utils import send_invite_email, verify_invite_token
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class ClientRegisterView(generics.CreateAPIView):
    serializer_class = ClientRegisterSerializer
    permission_classes = [permissions.AllowAny]

class ExpertRegisterView(generics.CreateAPIView):
    serializer_class = ExpertRegisterSerializer
    permission_classes = [permissions.AllowAny]

class AdminPasswordChangeView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAdminUser]
    def update(self, request, *args, **kwargs):
        admin = request.user
        new_password = request.data.get("new_password")
        admin.set_password(new_password)
        admin.save()
        return Response({"detail":"password changed"})
        return Response({"detail":"password changed"}, status=status.HTTP_200_OK)

class ExpertInviteView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return JsonResponse({'error': 'Email is required.'}, status=400)
        invite_url = send_invite_email(email, role='expert')
        return JsonResponse({'detail': 'Invite sent.', 'invite_url': invite_url})

class ExpertInviteAcceptView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get('token')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        if not token or not password:
            return JsonResponse({'error': 'Token and password are required.'}, status=400)
        email = verify_invite_token(token)
        if not email:
            return JsonResponse({'error': 'Invalid or expired invite token.'}, status=400)
        # Check if user already exists
        from .models import User
        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'User with this email already exists.'}, status=400)
        # Create expert user
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role='expert',
        )
        user.save()
        return JsonResponse({'detail': 'Expert account created successfully.'}, status=201)


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['email'] = user.email
        return token

    def validate(self, attrs):
        # Map email into username expected by the parent validate
        data = {'username': attrs.get('email'), 'password': attrs.get('password')}
        return super().validate(data)


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return super().get_queryset()
        return User.objects.filter(id=user.id)


class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        new_password = request.data.get('new_password')
        if not new_password:
            return Response({"detail": "new_password is required"}, status=400)
        request.user.set_password(new_password)
        request.user.save()
        return Response({"detail": "password changed"})


class ExpertRegistrationView(generics.CreateAPIView):
    serializer_class = ExpertRegisterSerializer
    permission_classes = [permissions.AllowAny]
