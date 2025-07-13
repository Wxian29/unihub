from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    """Post Serializers"""
    author_name = serializers.CharField(source='author.username', read_only=True)
    community_name = serializers.CharField(source='community.name', read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id', 'content', 'author', 'author_name', 'community', 
            'community_name', 'image', 'created_at', 'updated_at'
        ]
        read_only_fields = ['author', 'created_at', 'updated_at']


class PostDetailSerializer(PostSerializer):
    """Post Detail Serializers"""
    pass 