from rest_framework import serializers
from .models import User, ClientProfile, ExpertProfile
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","username","email","first_name","last_name","role"]

class ClientRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    country = serializers.CharField(write_only=True, required=False)
    user_type = serializers.CharField(write_only=True, required=False)
    company_name = serializers.CharField(write_only=True, required=False)
    contact = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ["username","email","password","first_name","last_name","country","user_type","company_name","contact"]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        country = validated_data.pop("country", "")
        user_type = validated_data.pop("user_type", "student")
        company_name = validated_data.pop("company_name","")
        contact = validated_data.pop("contact","")
        user = User.objects.create_user(**{k:v for k,v in validated_data.items() if k in ["username","email","password","first_name","last_name"]})
        user.role = "client"
        user.set_password(validated_data["password"])
        user.save()
        profile = user.client_profile
        profile.country = country
        profile.user_type = user_type
        profile.company_name = company_name
        profile.contact = contact
        profile.save()
        return user

class ExpertRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    expertise = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username","email","password","first_name","last_name","expertise"]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        expertise = validated_data.pop("expertise")
        user = User.objects.create_user(**{k:v for k,v in validated_data.items() if k in ["username","email","password","first_name","last_name"]})
        user.role = "expert"
        user.set_password(validated_data["password"])
        user.save()
        ep = user.expert_profile
        ep.expertise = expertise
        ep.save()
        return user
