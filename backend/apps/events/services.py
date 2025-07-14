"""
events/services.py
Business logic for event creation, participant management, and event filtering.
"""

from .models import Event, EventParticipant
from django.contrib.auth import get_user_model
from apps.notifications.services import create_notification
from django.db import transaction

User = get_user_model()

def create_event(validated_data, community):
    """
    Create a new event for a given community.
    Args:
        validated_data (dict): Event data.
        community (Community): The community instance.
    Returns:
        event (Event): The created event instance.
    """
    event = Event.objects.create(**validated_data, community=community)
    return event

def add_participant(event, user):
    """
    Register a user as a participant in an event and send notification.
    Uses transaction.atomic to ensure data consistency.
    """
    with transaction.atomic():
        participant, created = EventParticipant.objects.get_or_create(event=event, user=user)
        if created:
            create_notification(user, f"You have been registered for the event '{event.title}'.")
        return participant

def remove_participant(event, user):
    """
    Remove a user from an event's participants.
    Uses transaction.atomic to ensure data consistency.
    """
    with transaction.atomic():
        try:
            participant = EventParticipant.objects.get(event=event, user=user)
            participant.delete()
            return True
        except EventParticipant.DoesNotExist:
            return False

def update_event(event, update_data):
    """
    Update event details.
    Args:
        event (Event): The event instance to update.
        update_data (dict): Fields to update.
    Returns:
        event (Event): The updated event instance.
    """
    for attr, value in update_data.items():
        setattr(event, attr, value)
    event.save()
    return event 