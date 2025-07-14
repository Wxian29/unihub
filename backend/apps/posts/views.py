from rest_framework import generics, permissions, status
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Post, Comment
from .serializers import PostSerializer, PostDetailSerializer, CommentSerializer


class PostListView(generics.ListCreateAPIView):
    """Post List View"""
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['community', 'author']
    search_fields = ['content']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    def get_queryset(self):
        # Use select_related to optimize author and community queries
        queryset = Post.objects.select_related('author', 'community').all()
        user = self.request.user
        is_platform_admin = user.is_superuser or user.is_staff

        if not is_platform_admin:
            from apps.communities.models import CommunityMember
            from django.db import models
            member_community_ids = CommunityMember.objects.filter(
                user=user, is_active=True
            ).values_list('community_id', flat=True)
            queryset = queryset.filter(
                models.Q(community__in=member_community_ids) |
                models.Q(author=user) |
                models.Q(community__isnull=True)
            )

        community_id = self.request.query_params.get('community_id')
        if community_id:
            queryset = queryset.filter(community_id=community_id)
        author_id = self.request.query_params.get('author_id')
        if author_id:
            queryset = queryset.filter(author_id=author_id)
        return queryset


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Post Detail View"""
    queryset = Post.objects.select_related('author', 'community').all()
    serializer_class = PostDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]
    
    def get_object(self):
        obj = super().get_object()
        # Only the author can edit and delete
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            if obj.author != self.request.user:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("You do not have permission to edit this post")
        return obj

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context 


class CommentListCreateView(generics.ListCreateAPIView):
    """
    API view to list and create comments for a post
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        post_id = self.kwargs.get('post_id')
        return Comment.objects.filter(post_id=post_id)

    def perform_create(self, serializer):
        post_id = self.kwargs.get('post_id')
        serializer.save(author=self.request.user, post_id=post_id) 