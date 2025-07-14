from django.db import models
from django.conf import settings

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('system', 'System'),
        ('community', 'Community'),
        ('event', 'Event'),
        ('other', 'Other'),
    ]
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications', verbose_name='Receiver')
    content = models.TextField('Content')
    type = models.CharField('Type', max_length=20, choices=NOTIFICATION_TYPES, default='system')
    is_read = models.BooleanField('Read', default=False)
    created_at = models.DateTimeField('Creation time', auto_now_add=True)

    class Meta:
        verbose_name = 'Notify'
        verbose_name_plural = 'Notify'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.recipient} - {self.content[:20]}"
