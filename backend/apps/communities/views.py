from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Community, CommunityMember
from .serializers import (
    CommunitySerializer, CommunityDetailSerializer, CommunityMemberSerializer
)
from .permissions import IsCommunityAdmin
from django.utils import timezone
from .models import InterestTag
from .serializers import InterestTagSerializer


class CommunityListView(generics.ListCreateAPIView):
    """Community List View"""
    queryset = Community.objects.filter(is_public=True)
    serializer_class = CommunitySerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_public']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']
    
    def get_permissions(self):
        if self.request.method == 'POST':
            # Only platform admins, community leaders, or community admins can create a community
            from rest_framework.exceptions import PermissionDenied
            from apps.communities.models import CommunityMember
            user = self.request.user
            is_platform_admin = user.is_authenticated and (user.is_staff or user.is_superuser)
            is_community_leader_or_admin = CommunityMember.objects.filter(user=user, role__in=['community_leader', 'admin'], is_active=True).exists()
            if not (is_platform_admin or is_community_leader_or_admin):
                raise PermissionDenied('Only platform admins, community leaders, or community admins can create a community.')
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class CommunityDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Community details view"""
    serializer_class = CommunityDetailSerializer
    
    def get_queryset(self):
        return Community.objects.prefetch_related('members__user', 'tags').all()
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsCommunityAdmin()]
        return [permissions.AllowAny()]
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class CommunityMemberListView(generics.ListCreateAPIView):
    """Community member list view"""
    serializer_class = CommunityMemberSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        community_id = self.kwargs.get('community_id')
        return CommunityMember.objects.filter(community_id=community_id, is_active=True)
    
    def perform_create(self, serializer):
        community_id = self.kwargs.get('community_id')
        community = Community.objects.get(id=community_id)
        serializer.save(user=self.request.user, community=community)


class CommunityMemberDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Community member details view - used to modify roles or remove members"""
    serializer_class = CommunityMemberSerializer
    permission_classes = [permissions.IsAuthenticated, IsCommunityAdmin]
    
    def get_queryset(self):
        community_id = self.kwargs.get('community_id')
        return CommunityMember.objects.filter(community_id=community_id, is_active=True)
    
    def get_object(self):
        """Get a specific member object"""
        community_id = self.kwargs.get('community_id')
        member_id = self.kwargs.get('member_id')
        return CommunityMember.objects.get(
            id=member_id,
            community_id=community_id,
            is_active=True
        )
    
    def update(self, request, *args, **kwargs):
        """Update member information (mainly roles)"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """Remove members (soft delete)"""
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response({'message': 'Member removed'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def join_community(request, community_id):
    """Join the community (优化：支持重新加入)"""
    try:
        community = Community.objects.get(id=community_id)
        # 检查是否已是活跃成员
        if community.members.filter(user=request.user, is_active=True).exists():
            return Response({'message': 'You are already a member of this community'}, status=status.HTTP_400_BAD_REQUEST)
        # 检查是否有历史成员记录
        member = community.members.filter(user=request.user, is_active=False).first()
        if member:
            member.is_active = True
            member.joined_at = timezone.now()  # 可选：重置加入时间
            member.save()
            return Response({'message': 'Successfully re-joined the community'}, status=status.HTTP_200_OK)
        # 否则新建成员记录
        CommunityMember.objects.create(user=request.user, community=community)
        return Response({'message': 'Successfully joined the community'}, status=status.HTTP_201_CREATED)
    except Community.DoesNotExist:
        return Response({'message': 'The community does not exist'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def leave_community(request, community_id):
    """Exit the community"""
    try:
        membership = CommunityMember.objects.get(
            user=request.user, 
            community_id=community_id, 
            is_active=True
        )
        membership.is_active = False
        membership.save()
        return Response({'message': 'Successfully exited the community'}, status=status.HTTP_200_OK)
    except CommunityMember.DoesNotExist:
        return Response({'message': 'You are not a member of this community'}, status=status.HTTP_400_BAD_REQUEST)


class InterestTagListView(generics.ListCreateAPIView):
    """Interest Tag List View"""
    queryset = InterestTag.objects.all()
    serializer_class = InterestTagSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.request.method == 'POST':
            # Only staff can create tags
            return [permissions.IsAuthenticated(), permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]


class InterestTagDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Interest Tag Detail View"""
    queryset = InterestTag.objects.all()
    serializer_class = InterestTagSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser()]


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_communities(request):
    """Get communities that the current user is a member of"""
    user_communities = Community.objects.filter(
        members__user=request.user,
        members__is_active=True
    ).distinct()
    
    serializer = CommunitySerializer(user_communities, many=True, context={'request': request})
    return Response(serializer.data) 