from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, Profile
from apps.communities.models import CommunityMember


class ProfileInline(admin.StackedInline):
    """Inline editing of user profiles"""
    model = Profile
    can_delete = False
    verbose_name_plural = 'User Profile'
    fk_name = 'user'


class CommunityMemberInline(admin.TabularInline):
    model = CommunityMember
    extra = 0
    fields = ('community', 'role', 'is_active', 'joined_at')
    readonly_fields = ('joined_at',)
    autocomplete_fields = ('community',)


class UserAdmin(BaseUserAdmin):
    """Customize the user management interface"""
    inlines = (ProfileInline, CommunityMemberInline)
    list_display = ('email', 'username', 'first_name', 'last_name', 'role', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active', 'groups', 'date_joined')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    # 禁止直接编辑is_staff
    readonly_fields = ('is_staff',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('personal information'), {'fields': ('username', 'first_name', 'last_name', 'bio', 'avatar', 'major', 'student_id', 'role')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important Dates'), {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'role'),
        }),
    )

    def save_model(self, request, obj, form, change):
        # 每次保存都自动同步 is_staff
        if obj.role == 'admin':
            obj.is_staff = True
        else:
            obj.is_staff = False
        super().save_model(request, obj, form, change)


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