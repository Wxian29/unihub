from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.conf import settings

User = get_user_model()


class Community(models.Model):
    """Community Model"""
    name = models.CharField(max_length=100, verbose_name='Community Name')
    description = models.TextField(verbose_name='Description')
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_communities', db_index=True)  # Indexed for fast creator queries
    is_public = models.BooleanField(default=True, verbose_name='Public')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    cover_image = models.ImageField(upload_to='community_covers/', blank=True, null=True, verbose_name='Cover Image')
    tags = models.ManyToManyField('InterestTag', blank=True, related_name='communities', verbose_name='Interest Tags')
    
    class Meta:
        verbose_name = 'Community'
        verbose_name_plural = 'Communities'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    @property
    def member_count(self):
        return self.members.filter(is_active=True).count()


class CommunityMember(models.Model):
    ROLE_CHOICES = [
        ('member', 'Member'),
        ('admin', 'Admin'),
        ('community_leader', 'Community Leader'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='community_memberships')
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='members')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    joined_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ('user', 'community')
        verbose_name = 'Community Member'
        verbose_name_plural = 'Community Members'
    
    def __str__(self):
        return f"{self.user.username} - {self.community.name} ({self.role})"


class InterestTag(models.Model):
    """Interest tags for communities"""
    name = models.CharField(max_length=50, unique=True, verbose_name='Tag Name')
    description = models.TextField(blank=True, verbose_name='Description')
    color = models.CharField(max_length=7, default='#007bff', verbose_name='Tag Color')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Interest Tag'
        verbose_name_plural = 'Interest Tags'
        ordering = ['name']
    
    def __str__(self):
        return self.name 