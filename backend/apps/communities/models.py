from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

User = get_user_model()


class Community(models.Model):
    """Community Model"""
    name = models.CharField(_('Community Name'), max_length=100)
    description = models.TextField(_('Community Description'), max_length=1000)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_communities')
    avatar = models.ImageField(_('Community Avatars'), upload_to='community_avatars/', blank=True, null=True)
    cover_image = models.ImageField(_('Community Covers'), upload_to='community_covers/', blank=True, null=True)
    is_public = models.BooleanField(_('Public'), default=True)
    max_members = models.PositiveIntegerField(_('Maximum number of members'), default=1000)
    created_at = models.DateTimeField(_('Creation time'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Update time'), auto_now=True)
    
    class Meta:
        verbose_name = 'Community'
        verbose_name_plural = 'Communities'
        ordering = ['-created_at']
    
    def __str__(self):
        return str(self.name)


class CommunityMember(models.Model):
    """Community Member Model"""
    ROLE_CHOICES = [
        ('admin', _('Admin')),
        ('community_leader', _('Community Leader')),
        ('member', _('Member')),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community_memberships')
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='members')
    role = models.CharField(_('Role'), max_length=20, choices=ROLE_CHOICES, default='member')
    joined_at = models.DateTimeField(_('Join Time'), auto_now_add=True)
    is_active = models.BooleanField(_('Active'), default=True)
    
    class Meta:
        verbose_name = 'Community Member'
        verbose_name_plural = 'Community Members'
        unique_together = ['user', 'community']
        ordering = ['-joined_at']
    
    def __str__(self):
        # Ensure all parts are string, avoid lazy object, and catch any error
        try:
            return f"{str(self.user.username)} - {str(self.community.name)} ({str(self.get_role_display())})"
        except Exception:
            return f"CommunityMember {self.pk}" 