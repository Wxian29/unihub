from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from .views import SessionLoginView, SessionLogoutView

app_name = 'users'

urlpatterns = [
    # Certification related
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.logout, name='logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Session-based authentication endpoints
    path('auth/session-login/', SessionLoginView.as_view(), name='session_login'),
    path('auth/session-logout/', SessionLogoutView.as_view(), name='session_logout'),
    
    # User Profile
    path('users/profile/', views.UserProfileView.as_view(), name='user_profile'),
    path('users/profile/detail/', views.ProfileDetailView.as_view(), name='profile_detail'),
] 