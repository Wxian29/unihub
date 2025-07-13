from rest_framework import generics, permissions, status
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Post
from .serializers import PostSerializer, PostDetailSerializer


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
        queryset = Post.objects.select_related('author', 'community').all()
        
        # Filter community post
        community_id = self.request.query_params.get('community_id')
        if community_id:
            queryset = queryset.filter(community_id=community_id)
        
        # Filter personal post
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