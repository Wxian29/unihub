from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from apps.communities.models import Community

User = get_user_model()


class Event(models.Model):
    """Event Model"""
    STATUS_CHOICES = [
        ('draft', _('Draft')),
        ('published', _('Published')),
        ('ongoing', _('Ongoing')),
        ('completed', _('Completed')),
        ('cancelled', _('Cancelled')),
    ]
    
    title = models.CharField(_('Event Title'), max_length=200)
    description = models.TextField(_('Event Description'))
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='events')
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_events')
    start_time = models.DateTimeField(_('Start Time'))
    end_time = models.DateTimeField(_('End Time'))
    location = models.CharField(_('Event Location'), max_length=200)
    max_participants = models.PositiveIntegerField(_('Maximum number of participants'), null=True, blank=True)
    current_participants = models.PositiveIntegerField(_('Current number of participants'), default=0)
    status = models.CharField(_('Status'), max_length=20, choices=STATUS_CHOICES, default='draft')
    cover_image = models.ImageField(_('Event Covers'), upload_to='event_covers/', blank=True, null=True)
    created_at = models.DateTimeField(_('Creation time'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Update time'), auto_now=True)
    
    class Meta:
        verbose_name = 'Event'
        verbose_name_plural = 'Events'
        ordering = ['-created_at']
    
    def __str__(self):
        return str(self.title)


class EventParticipant(models.Model):
    """Event Participant Model"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_participations')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='participants')
    registered_at = models.DateTimeField(_('Registration Period'), auto_now_add=True)
    is_attended = models.BooleanField(_('Participation'), default=False)
    
    class Meta:
        verbose_name = 'Participant'
        verbose_name_plural = 'Participants'
        unique_together = ['user', 'event']
        ordering = ['-registered_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.event.title}" 