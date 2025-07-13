from django.dispatch import receiver
from django.db.models.signals import post_save
from apps.communities.models import CommunityMember
from apps.events.models import EventParticipant
from .models import Notification

@receiver(post_save, sender=CommunityMember)
def create_community_notification(sender, instance, created, **kwargs):
    """Create a notification when a user joins the community"""
    if created:
        content = f"Welcome to join the community「{instance.community.name}」！"
        Notification.objects.create(
            recipient=instance.user,
            content=content,
            type='community'
        )

@receiver(post_save, sender=EventParticipant)
def create_event_notification(sender, instance, created, **kwargs):
    """Create a notification when a user signs up for an event"""
    if created:
        content = f"You have successfully registered for the event「{instance.event.title}」"
        Notification.objects.create(
            recipient=instance.user,
            content=content,
            type='event'
        ) 