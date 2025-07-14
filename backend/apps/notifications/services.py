"""
notifications/services.py
Business logic for notification creation and delivery.
"""

from .models import Notification
from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

User = get_user_model()

def create_notification(user, message, related_object=None):
    """
    Create a notification for a user with an optional related object.
    Args:
        user (User): The user to notify.
        message (str): The notification message.
        related_object (Model, optional): Related object for context.
    Returns:
        notification (Notification): The created notification instance.
    """
    notification = Notification.objects.create(user=user, message=message, related_object=related_object)
    return notification

def mark_notification_read(notification):
    """
    Mark a notification as read.
    Args:
        notification (Notification): The notification instance.
    Returns:
        notification (Notification): The updated notification instance.
    """
    notification.is_read = True
    notification.save()
    return notification

def get_unread_notifications(user):
    """
    Get all unread notifications for a user.
    Args:
        user (User): The user instance.
    Returns:
        QuerySet: Unread notifications for the user.
    """
    return Notification.objects.filter(user=user, is_read=False) 