from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Event, EventParticipant


class EventParticipantInline(admin.TabularInline):
    """Inline editing of event participants"""
    model = EventParticipant
    extra = 1
    fields = ('user', 'is_attended', 'registered_at')
    readonly_fields = ('registered_at',)


class EventAdmin(admin.ModelAdmin):
    """Activity management interface"""
    list_display = ('title', 'community', 'creator', 'start_time', 'end_time', 'status', 'participant_count')
    list_filter = ('status', 'start_time', 'end_time', 'created_at', 'community')
    search_fields = ('title', 'description', 'location', 'creator__email', 'community__name')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at', 'current_participants')
    
    fieldsets = (
        (_('Basic Information'), {
            'fields': ('title', 'description', 'community', 'creator')
        }),
        (_('Event Details'), {
            'fields': ('start_time', 'end_time', 'location', 'status')
        }),
        (_('Participation Settings'), {
            'fields': ('max_participants', 'current_participants', 'cover_image')
        }),
        (_('Time Information'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [EventParticipantInline]
    
    def participant_count(self, obj):
        """Display the number of participants"""
        return obj.participants.count()
    participant_count.short_description = 'Number of participants'
    
    def get_queryset(self, request):
        """Optimizing query performance"""
        return super().get_queryset(request).select_related('creator', 'community')


class EventParticipantAdmin(admin.ModelAdmin):
    """Event participant management interface"""
    list_display = ('user', 'event', 'is_attended', 'registered_at')
    list_filter = ('is_attended', 'registered_at', 'event__status')
    search_fields = ('user__email', 'user__username', 'event__title')
    ordering = ('-registered_at',)
    readonly_fields = ('registered_at',)
    
    fieldsets = (
        (_('Participant Information'), {
            'fields': ('user', 'event', 'is_attended')
        }),
        (_('Time Information'), {
            'fields': ('registered_at',),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Optimizing query performance"""
        return super().get_queryset(request).select_related('user', 'event')


# Registering Models
admin.site.register(Event, EventAdmin)
admin.site.register(EventParticipant, EventParticipantAdmin) 