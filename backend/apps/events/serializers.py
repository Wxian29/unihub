from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):
    """Event Serializer"""
    creator_name = serializers.CharField(source='creator.username', read_only=True)
    community_name = serializers.CharField(source='community.name', read_only=True)
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'community', 'community_name',
            'creator', 'creator_name', 'start_time', 'end_time', 'location',
            'max_participants', 'current_participants', 'status',
            'cover_image', 'created_at', 'updated_at'
        ]
        read_only_fields = ['creator', 'current_participants', 'created_at', 'updated_at']


class EventDetailSerializer(EventSerializer):
    """Event Details Serializer"""
    participants = serializers.SerializerMethodField()
    
    class Meta(EventSerializer.Meta):
        fields = EventSerializer.Meta.fields + ['participants']
    
    def get_participants(self, obj):
        return obj.participants.count() 