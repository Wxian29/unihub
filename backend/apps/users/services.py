"""
users/services.py
Business logic for user registration, authentication, and profile management.
"""

from django.contrib.auth import authenticate, get_user_model
from .models import Profile
from django.core.mail import send_mail

User = get_user_model()

def register_user(validated_data):
    """
    Register a new user, create profile, and send welcome email.
    Args:
        validated_data (dict): User registration data.
    Returns:
        user (User): The created user instance.
    """
    password = validated_data.pop('password')
    user = User.objects.create_user(password=password, **validated_data)
    # Create user profile
    Profile.objects.get_or_create(user=user)
    # Send welcome email (can be replaced with cloud email service)
    send_mail(
        subject="Welcome to UniHub!",
        message="Thank you for registering.",
        from_email="noreply@unihub.com",
        recipient_list=[user.email],
        fail_silently=True,
    )
    return user

def authenticate_user(email, password):
    """
    Authenticate a user by email and password.
    Returns the user instance if authentication is successful, otherwise None.
    """
    return authenticate(username=email, password=password)

def get_or_create_profile(user):
    """
    Retrieve the profile for the given user, creating one if it does not exist.
    """
    profile, created = Profile.objects.get_or_create(user=user)
    return profile

def update_user_profile(user, profile_data):
    """
    Update the profile for the given user.
    Args:
        user (User): The user instance.
        profile_data (dict): Profile fields to update.
    Returns:
        profile (Profile): The updated profile instance.
    """
    profile, _ = Profile.objects.get_or_create(user=user)
    for attr, value in profile_data.items():
        setattr(profile, attr, value)
    profile.save()
    return profile

def deactivate_user(user):
    """
    Deactivate a user account (soft delete).
    Args:
        user (User): The user instance to deactivate.
    Returns:
        user (User): The deactivated user instance.
    """
    user.is_active = False
    user.save()
    return user 