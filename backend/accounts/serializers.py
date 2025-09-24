"""
Serializers for accounts app
"""
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from .models import User, ClientProfile, ExpertProfile, ExpertInvitation, Notification


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'role', 'user_type', 'phone_number', 'is_verified', 
            'date_joined', 'last_login'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']


class ClientProfileSerializer(serializers.ModelSerializer):
    """Serializer for ClientProfile"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ClientProfile
        fields = [
            'id', 'user', 'country', 'company_name', 'company_email',
            'contact_person', 'budget_preference', 'preferred_communication'
        ]


class ExpertProfileSerializer(serializers.ModelSerializer):
    """Serializer for ExpertProfile"""
    user = UserSerializer(read_only=True)
    expertise_display = serializers.CharField(source='get_expertise_display', read_only=True)
    
    class Meta:
        model = ExpertProfile
        fields = [
            'id', 'user', 'expertise', 'expertise_display', 'bio', 
            'hourly_rate', 'availability', 'portfolio_url', 'linkedin_url',
            'github_url', 'years_experience', 'skills', 'rating', 'total_projects'
        ]


class ClientRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for client registration"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    # Client profile fields
    country = serializers.CharField(write_only=True, required=False)
    company_name = serializers.CharField(write_only=True, required=False)
    company_email = serializers.EmailField(write_only=True, required=False)
    contact_person = serializers.CharField(write_only=True, required=False)
    budget_preference = serializers.CharField(write_only=True, required=False)
    preferred_communication = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'user_type', 'phone_number',
            'country', 'company_name', 'company_email', 'contact_person',
            'budget_preference', 'preferred_communication'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        # Remove password_confirm and profile fields
        validated_data.pop('password_confirm')
        profile_data = {
            'country': validated_data.pop('country', ''),
            'company_name': validated_data.pop('company_name', ''),
            'company_email': validated_data.pop('company_email', ''),
            'contact_person': validated_data.pop('contact_person', ''),
            'budget_preference': validated_data.pop('budget_preference', ''),
            'preferred_communication': validated_data.pop('preferred_communication', 'email'),
        }
        
        # Create user
        user = User.objects.create_user(
            role='client',
            **validated_data
        )
        
        # Create client profile
        ClientProfile.objects.create(user=user, **profile_data)
        
        return user


class ExpertRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for expert registration via invitation"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)
    
    # Expert profile fields
    expertise = serializers.CharField(write_only=True)
    bio = serializers.CharField(write_only=True, required=False)
    hourly_rate = serializers.DecimalField(max_digits=10, decimal_places=2, write_only=True, required=False)
    portfolio_url = serializers.URLField(write_only=True, required=False)
    linkedin_url = serializers.URLField(write_only=True, required=False)
    github_url = serializers.URLField(write_only=True, required=False)
    years_experience = serializers.IntegerField(write_only=True, required=False)
    skills = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'phone_number', 'token',
            'expertise', 'bio', 'hourly_rate', 'portfolio_url',
            'linkedin_url', 'github_url', 'years_experience', 'skills'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        
        # Validate invitation token
        token = attrs['token']
        try:
            invitation = ExpertInvitation.objects.get(token=token)
            if not invitation.is_valid():
                raise serializers.ValidationError("Invalid or expired invitation token")
            attrs['invitation'] = invitation
        except ExpertInvitation.DoesNotExist:
            raise serializers.ValidationError("Invalid invitation token")
        
        return attrs
    
    def create(self, validated_data):
        # Remove password_confirm and profile fields
        validated_data.pop('password_confirm')
        invitation = validated_data.pop('invitation')
        
        profile_data = {
            'expertise': validated_data.pop('expertise'),
            'bio': validated_data.pop('bio', ''),
            'hourly_rate': validated_data.pop('hourly_rate', None),
            'portfolio_url': validated_data.pop('portfolio_url', ''),
            'linkedin_url': validated_data.pop('linkedin_url', ''),
            'github_url': validated_data.pop('github_url', ''),
            'years_experience': validated_data.pop('years_experience', 0),
            'skills': validated_data.pop('skills', []),
        }
        
        # Set email from invitation
        validated_data['email'] = invitation.email
        
        # Create user
        user = User.objects.create_user(
            role='expert',
            **validated_data
        )
        
        # Create expert profile
        ExpertProfile.objects.create(user=user, **profile_data)
        
        # Mark invitation as used
        invitation.is_used = True
        invitation.used_at = timezone.now()
        invitation.save()
        
        return user


class ExpertInvitationSerializer(serializers.ModelSerializer):
    """Serializer for expert invitations"""
    invited_by_name = serializers.CharField(source='invited_by.get_full_name', read_only=True)
    expertise_display = serializers.CharField(source='get_expertise_display', read_only=True)
    is_valid = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = ExpertInvitation
        fields = [
            'id', 'email', 'expertise', 'expertise_display', 'invited_by_name',
            'created_at', 'expires_at', 'is_used', 'is_valid'
        ]
        read_only_fields = ['id', 'token', 'invited_by', 'created_at', 'expires_at']


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for notifications"""
    notification_type_display = serializers.CharField(source='get_notification_type_display', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'notification_type_display', 'title',
            'message', 'is_read', 'related_object_id', 'related_object_type',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change"""
    old_password = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    new_password_confirm = serializers.CharField()
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value