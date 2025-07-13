from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from apps.communities.models import Community

User = get_user_model()


class Post(models.Model):
    """Post Model"""
    content = models.TextField(_('Content'))
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='posts', null=True, blank=True)
    image = models.ImageField(_('Image'), upload_to='post_images/', blank=True, null=True)
    created_at = models.DateTimeField(_('Creation time'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Update time'), auto_now=True)
    
    class Meta:
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.author.username} Post" 