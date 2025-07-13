"""
URL configuration for uni_hub_core project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def api_root(request):
    """API root path view, returns available API endpoints"""
    api_endpoints = {
        "message": "Uni Hub API v1",
        "endpoints": {
            "authentication": {
                "register": "/api/v1/users/auth/register/",
                "login": "/api/v1/users/auth/login/",
                "logout": "/api/v1/users/auth/logout/",
                "token_refresh": "/api/v1/users/auth/token/refresh/"
            },
            "users": {
                "profile": "/api/v1/users/users/profile/",
                "profile_detail": "/api/v1/users/users/profile/detail/"
            },
            "communities": {
                "list": "/api/v1/communities/",
                "detail": "/api/v1/communities/{id}/",
                "join": "/api/v1/communities/{id}/join/",
                "leave": "/api/v1/communities/{id}/leave/",
                "members": "/api/v1/communities/{id}/members/"
            },
            "events": {
                "list": "/api/v1/events/",
                "detail": "/api/v1/events/{id}/",
                "join": "/api/v1/events/{id}/join/",
                "leave": "/api/v1/events/{id}/leave/",
                "participants": "/api/v1/events/{id}/participants/"
            },
            "posts": {
                "list": "/api/v1/posts/",
                "detail": "/api/v1/posts/{id}/"
            },
            "notifications": {
                "list": "/api/v1/notifications/",
                "mark_read": "/api/v1/notifications/{id}/read/"
            }
        },
        "admin": "/admin/"
    }
    return JsonResponse(api_endpoints, json_dumps_params={'indent': 2})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/users/', include('apps.users.urls')),
    path('api/v1/communities/', include('apps.communities.urls')),
    path('api/v1/events/', include('apps.events.urls')),
    path('api/v1/posts/', include('apps.posts.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),
    path('api/v1/', api_root),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 