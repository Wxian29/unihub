"""
posts/services.py
Business logic for post creation, filtering, and deletion.
"""

from .models import Post
from django.contrib.auth import get_user_model
from apps.notifications.services import create_notification

User = get_user_model()

def create_post(validated_data, author):
    """
    Create a new post by the given author and send notification.
    Args:
        validated_data (dict): Post data.
        author (User): The author of the post.
    Returns:
        post (Post): The created post instance.
    """
    post = Post.objects.create(**validated_data, author=author)
    # Send notification to author (can be extended to followers)
    create_notification(author, f"Your post has been published.")
    return post

def update_post(post, update_data):
    """
    Update a post instance.
    Args:
        post (Post): The post instance to update.
        update_data (dict): Fields to update.
    Returns:
        post (Post): The updated post instance.
    """
    for attr, value in update_data.items():
        setattr(post, attr, value)
    post.save()
    return post

def delete_post(post):
    """
    Delete a post instance.
    Args:
        post (Post): The post instance to delete.
    Returns:
        None
    """
    post.delete()

def like_post(post, user):
    """
    Like a post (placeholder, requires Like model implementation).
    Args:
        post (Post): The post to like.
        user (User): The user who likes the post.
    Returns:
        None
    """
    # Implement like logic here (e.g., create Like object)
    pass 