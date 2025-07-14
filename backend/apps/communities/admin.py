from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Community, CommunityMember, InterestTag


class CommunityAdmin(admin.ModelAdmin):
    """Community management interface"""
    list_display = ('name', 'creator', 'is_public', 'created_at', 'member_count')
    list_filter = ('is_public', 'created_at', 'updated_at')
    search_fields = ('name', 'description', 'creator__email', 'creator__username')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        (_('Basic Information'), {
            'fields': ('name', 'description', 'creator')
        }),
        (_('Community Settings'), {
            'fields': ('cover_image', 'is_public', 'tags')
        }),
        (_('Time Information'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def member_count(self, obj):
        """Display number of members"""
        return obj.members.filter(is_active=True).count()
    member_count.short_description = 'Number of members'
    
    def get_queryset(self, request):
        """Optimizing query performance"""
        return super().get_queryset(request).select_related('creator')


class CommunityMemberAdmin(admin.ModelAdmin):
    """Community member management interface"""
    list_display = ('user', 'community', 'is_active', 'joined_at')
    list_filter = ('is_active', 'joined_at', 'community')
    search_fields = ('user__email', 'user__username', 'community__name')
    ordering = ('-joined_at',)
    readonly_fields = ('joined_at',)
    
    fieldsets = (
        (_('Member Information'), {
            'fields': ('user', 'community', 'is_active')
        }),
        (_('Time Information'), {
            'fields': ('joined_at',),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Optimizing query performance"""
        return super().get_queryset(request).select_related('user', 'community')


class InterestTagAdmin(admin.ModelAdmin):
    """Interest Tag management interface"""
    list_display = ('name', 'description', 'color', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'description')
    ordering = ('name',)
    readonly_fields = ('created_at',)
    
    fieldsets = (
        (_('Tag Information'), {
            'fields': ('name', 'description', 'color')
        }),
        (_('Time Information'), {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


# Registering Models
admin.site.register(Community, CommunityAdmin)
admin.site.register(CommunityMember, CommunityMemberAdmin)
admin.site.register(InterestTag, InterestTagAdmin)
