from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from apps.communities.models import Community

User = get_user_model()


class Post(models.Model):
    """Post Model"""
    content = models.TextField(_('Content'))
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts', db_index=True)  # Indexed for fast author queries
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='posts', null=True, blank=True, db_index=True)  # Indexed for fast community queries
    image = models.ImageField(_('Image'), upload_to='post_images/', blank=True, null=True)
    created_at = models.DateTimeField(_('Creation time'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Update time'), auto_now=True)
    
    class Meta:
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.author.username} Post" 


class Comment(models.Model):
    """
    Comment Model for Post
    Each comment is linked to a post and an author (user).
    """
    content = models.TextField('Comment Content')
    created_at = models.DateTimeField('Comment time', auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')

    class Meta:
        verbose_name = 'Comment'
        verbose_name_plural = 'Comments'
        ordering = ['-created_at']

    def __str__(self):
        return f"Comment by {self.author.username} on Post {self.post.id}" 


class Like(models.Model):
    """
    Like Model for Post
    Each like is linked to a post and a user. A user can like a post only once.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')
        verbose_name = 'Like'
        verbose_name_plural = 'Likes'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} likes Post {self.post.id}"

# Add a property to Post to get like count
Post.add_to_class('like_count', property(lambda self: self.likes.count())) 