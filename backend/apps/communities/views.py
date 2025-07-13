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
    queryset = Community.objects.all()
    serializer_class = CommunityDetailSerializer
    
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
    """Join the community"""
    try:
        community = Community.objects.get(id=community_id)
        if community.members.filter(user=request.user, is_active=True).exists():
            return Response({'message': 'You are already a member of this community'}, status=status.HTTP_400_BAD_REQUEST)
        
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