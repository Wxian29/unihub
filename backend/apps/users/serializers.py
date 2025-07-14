from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Profile


class UserSerializer(serializers.ModelSerializer):
    """User Serializer"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'bio', 'avatar', 'major', 'student_id', 'role', 'is_staff', 'is_superuser']
        read_only_fields = ['id', 'username', 'email']


class ProfileSerializer(serializers.ModelSerializer):
    """Profile Serializer"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Profile
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']


class RegisterSerializer(serializers.ModelSerializer):
    """Register Serializer"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """Login Serializer"""
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Wrong email or password')
            if not user.is_active:
                raise serializers.ValidationError('User account has been disabled')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Please provide your email and password') 