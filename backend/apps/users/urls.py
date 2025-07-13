from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'users'

urlpatterns = [
    # Certification related
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.logout, name='logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User Profile
    path('users/profile/', views.UserProfileView.as_view(), name='user_profile'),
    path('users/profile/detail/', views.ProfileDetailView.as_view(), name='profile_detail'),
] 