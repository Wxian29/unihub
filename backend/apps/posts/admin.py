from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Post


class PostAdmin(admin.ModelAdmin):
    """Post Management Interface"""
    list_display = ('author', 'content_preview', 'community', 'created_at')
    list_filter = ('created_at', 'updated_at', 'community')
    search_fields = ('content', 'author__email', 'author__username', 'community__name')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        (_('Post content'), {
            'fields': ('content', 'author', 'community', 'image')
        }),
        (_('Time Information'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def content_preview(self, obj):
        """Content Preview"""
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content Preview'
    

    
    def get_queryset(self, request):
        """Optimizing query performance"""
        return super().get_queryset(request).select_related('author', 'community')


# Registering Models
admin.site.register(Post, PostAdmin) 