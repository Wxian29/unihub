from django.urls import path
from . import views

app_name = 'posts'

urlpatterns = [
    # Post Management
    path('', views.PostListView.as_view(), name='post_list'),
    path('<int:pk>/', views.PostDetailView.as_view(), name='post_detail'),
    # Comment Management
    path('<int:post_id>/comments/', views.CommentListCreateView.as_view(), name='post_comments'),
    # Like Management
    path('<int:post_id>/like/', views.LikePostView.as_view(), name='post_like'),
    path('<int:post_id>/unlike/', views.UnlikePostView.as_view(), name='post_unlike'),
    path('<int:post_id>/likes/', views.PostLikesListView.as_view(), name='post_likes'),
] 