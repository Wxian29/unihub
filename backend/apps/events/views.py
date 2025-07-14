from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from .models import Event, EventParticipant
from .serializers import EventSerializer, EventDetailSerializer
from .permissions import IsEventOwnerOrCommunityAdmin
from rest_framework import serializers


class EventListView(generics.ListCreateAPIView):
    """Event List View"""
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Use select_related to optimize creator and community queries
        queryset = Event.objects.select_related('creator', 'community').all()
        
        # Search Function
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search) |
                Q(location__icontains=search)
            )
        
        # Status Filter
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Community filtering
        community_id = self.request.query_params.get('community', None)
        if community_id:
            queryset = queryset.filter(community_id=community_id)
        
        # My Event
        my_events = self.request.query_params.get('my_events', None)
        if my_events == 'true':
            queryset = queryset.filter(creator=self.request.user)
        
        # Event I participated in
        my_participations = self.request.query_params.get('my_participations', None)
        if my_participations == 'true':
            event_ids = EventParticipant.objects.filter(user=self.request.user).values_list('event_id', flat=True)
            queryset = queryset.filter(id__in=event_ids)
        
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        # Check if user is a member of the selected community
        community = serializer.validated_data.get('community')
        if community:
            from apps.communities.models import CommunityMember
            is_member = CommunityMember.objects.filter(
                user=self.request.user,
                community=community,
                is_active=True
            ).exists()
            
            if not is_member:
                raise serializers.ValidationError(
                    "You can only create events in communities you are a member of."
                )
        
        serializer.save(creator=self.request.user)


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Event details view"""
    queryset = Event.objects.all()
    serializer_class = EventDetailSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsEventOwnerOrCommunityAdmin()]
        return [permissions.IsAuthenticated()]
    
    def update(self, request, *args, **kwargs):
        # Check if user is trying to change the community
        instance = self.get_object()
        new_community = request.data.get('community')
        
        if new_community and new_community != instance.community.id:
            from apps.communities.models import CommunityMember
            is_member = CommunityMember.objects.filter(
                user=request.user,
                community_id=new_community,
                is_active=True
            ).exists()
            
            if not is_member:
                raise serializers.ValidationError(
                    "You can only move events to communities you are a member of."
                )
        
        return super().update(request, *args, **kwargs)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        
        # Add information on whether the user has registered
        if request.user.is_authenticated:
            is_participant = EventParticipant.objects.filter(
                user=request.user, 
                event=instance
            ).exists()
            data['is_participant'] = is_participant
        
        return Response(data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def join_event(request, event_id):
    """Attend an event"""
    try:
        event = Event.objects.get(id=event_id)
        
        # Check event status
        if event.status not in ['published', 'ongoing']:
            return Response({'message': 'Registration is not open for this event'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if you have registered
        if EventParticipant.objects.filter(user=request.user, event=event).exists():
            return Response({'message': 'You have already registered for this event'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check the number of people
        if event.max_participants and event.current_participants >= event.max_participants:
            return Response({'message': 'Full attendance'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create a registration record
        EventParticipant.objects.create(user=request.user, event=event)
        
        # Update the number of participants
        event.current_participants += 1
        event.save()
        
        return Response({'message': 'Successfully registered for the event'}, status=status.HTTP_201_CREATED)
    except Event.DoesNotExist:
        return Response({'message': 'Event does not exist'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def leave_event(request, event_id):
    """Exit event"""
    try:
        participation = EventParticipant.objects.get(
            user=request.user, 
            event_id=event_id
        )
        participation.delete()
        
        # Update the number of participants
        event = Event.objects.get(id=event_id)
        event.current_participants = max(0, event.current_participants - 1)
        event.save()
        
        return Response({'message': 'Successfully exited the event'}, status=status.HTTP_200_OK)
    except EventParticipant.DoesNotExist:
        return Response({'message': 'You are not registered for this event'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_event_status(request, event_id):
    """Update event status"""
    try:
        event = Event.objects.get(id=event_id)
        
        # Check permissions
        if not (request.user == event.creator or request.user.is_staff):
            return Response({'message': 'No permission to operate this event'}, status=status.HTTP_403_FORBIDDEN)
        
        new_status = request.data.get('status')
        if new_status not in dict(Event.STATUS_CHOICES):
            return Response({'message': 'Invalid status value'}, status=status.HTTP_400_BAD_REQUEST)
        
        event.status = new_status
        event.save()
        
        return Response({'message': 'Event status updated successfully'}, status=status.HTTP_200_OK)
    except Event.DoesNotExist:
        return Response({'message': 'Event does not exist'}, status=status.HTTP_404_NOT_FOUND) 