from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """Extended User Model"""
    email = models.EmailField(_('Email'), unique=True)
    bio = models.TextField(_('Personal Profile'), max_length=500, blank=True)
    avatar = models.ImageField(_('Avatar'), upload_to='avatars/', blank=True, null=True)
    major = models.CharField(_('Major'), max_length=100, blank=True)
    student_id = models.CharField(_('Student ID'), max_length=20, blank=True)
    
    # Use email address as username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return str(self.email)


class Profile(models.Model):
    """User details"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(_('Phone number'), max_length=20, blank=True)
    birth_date = models.DateField(_('date of birth'), null=True, blank=True)
    location = models.CharField(_('location'), max_length=100, blank=True)
    website = models.URLField(_('Personal website'), blank=True)
    created_at = models.DateTimeField(_('Creation time'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Update time'), auto_now=True)
    
    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'
    
    def __str__(self):
        return f"{self.user.username} Profile" 