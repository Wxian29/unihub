from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, Profile


class ProfileInline(admin.StackedInline):
    """Inline editing of user profiles"""
    model = Profile
    can_delete = False
    verbose_name_plural = 'User Profile'
    fk_name = 'user'


class UserAdmin(BaseUserAdmin):
    """Customize the user management interface"""
    inlines = (ProfileInline,)
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups', 'date_joined')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('personal information'), {'fields': ('username', 'first_name', 'last_name', 'bio', 'avatar', 'major', 'student_id')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important Dates'), {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )


class ProfileAdmin(admin.ModelAdmin):
    """User profile management interface"""
    list_display = ('user', 'phone', 'birth_date', 'location', 'created_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('user__email', 'user__username', 'phone', 'location')
    ordering = ('-created_at',)
    
    fieldsets = (
        (_('Basic Information'), {
            'fields': ('user', 'phone', 'birth_date', 'location')
        }),
        (_('Additional Information'), {
            'fields': ('website', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at', 'updated_at')


# Registering Models
admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin) 