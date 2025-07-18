from django.urls import path
from . import views

app_name = 'communities'

urlpatterns = [
    # Community Management
    path('', views.CommunityListView.as_view(), name='community_list'),
    path('user/', views.user_communities, name='user_communities'),
    path('<int:pk>/', views.CommunityDetailView.as_view(), name='community_detail'),
    path('<int:community_id>/members/', views.CommunityMemberListView.as_view(), name='community_members'),
    path('<int:community_id>/members/<int:member_id>/', views.CommunityMemberDetailView.as_view(), name='community_member_detail'),
    path('<int:community_id>/join/', views.join_community, name='join_community'),
    path('<int:community_id>/leave/', views.leave_community, name='leave_community'),
    
    # Interest Tags
    path('tags/', views.InterestTagListView.as_view(), name='interest_tag_list'),
    path('tags/<int:pk>/', views.InterestTagDetailView.as_view(), name='interest_tag_detail'),
] 