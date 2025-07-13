from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Community, CommunityMember


class CommunityMemberInline(admin.TabularInline):
    """Inline editing by community members"""
    model = CommunityMember
    extra = 1
    fields = ('user', 'role', 'is_active', 'joined_at')
    readonly_fields = ('joined_at',)


class CommunityAdmin(admin.ModelAdmin):
    """Community management interface"""
    list_display = ('name', 'creator', 'is_public', 'max_members', 'created_at', 'member_count')
    list_filter = ('is_public', 'created_at', 'updated_at')
    search_fields = ('name', 'description', 'creator__email', 'creator__username')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        (_('Basic Information'), {
            'fields': ('name', 'description', 'creator')
        }),
        (_('Community Settings'), {
            'fields': ('avatar', 'cover_image', 'is_public', 'max_members')
        }),
        (_('Time Information'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [CommunityMemberInline]
    
    def member_count(self, obj):
        """Display number of members"""
        return obj.members.filter(is_active=True).count()
    member_count.short_description = 'Number of members'
    
    def get_queryset(self, request):
        """Optimizing query performance"""
        return super().get_queryset(request).select_related('creator')


class CommunityMemberAdmin(admin.ModelAdmin):
    """Community member management interface"""
    list_display = ('user', 'community', 'role', 'is_active', 'joined_at')
    list_filter = ('role', 'is_active', 'joined_at', 'community')
    search_fields = ('user__email', 'user__username', 'community__name')
    ordering = ('-joined_at',)
    readonly_fields = ('joined_at',)
    
    fieldsets = (
        (_('Member Information'), {
            'fields': ('user', 'community', 'role', 'is_active')
        }),
        (_('Time Information'), {
            'fields': ('joined_at',),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Optimizing query performance"""
        return super().get_queryset(request).select_related('user', 'community')


# Registering Models
admin.site.register(Community, CommunityAdmin)
admin.site.register(CommunityMember, CommunityMemberAdmin) 