from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Post, Comment, Like


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


class CommentAdmin(admin.ModelAdmin):
    """Comment Management Interface"""
    list_display = ('author', 'post', 'content_preview', 'created_at')
    list_filter = ('created_at', 'author', 'post')
    search_fields = ('content', 'author__email', 'author__username', 'post__id')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)

    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content Preview'


class LikeAdmin(admin.ModelAdmin):
    """Like Management Interface"""
    list_display = ('user', 'post', 'created_at')
    list_filter = ('created_at', 'user', 'post')
    search_fields = ('user__email', 'user__username', 'post__id')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)


# Registering Models
admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Like, LikeAdmin) 