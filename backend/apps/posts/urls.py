from django.urls import path
from . import views

app_name = 'posts'

urlpatterns = [
    # Post Management
    path('', views.PostListView.as_view(), name='post_list'),
    path('<int:pk>/', views.PostDetailView.as_view(), name='post_detail'),
] 