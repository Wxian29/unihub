from rest_framework import serializers
from .models import Post, Comment, Like


class PostSerializer(serializers.ModelSerializer):
    """Post Serializers"""
    author_name = serializers.CharField(source='author.username', read_only=True)
    community_name = serializers.CharField(source='community.name', read_only=True)
    like_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id', 'content', 'author', 'author_name', 'community', 
            'community_name', 'image', 'created_at', 'updated_at', 'like_count'
        ]
        read_only_fields = ['author', 'created_at', 'updated_at']

    def validate(self, attrs):
        request = self.context.get('request')
        user = request.user if request else None
        community = attrs.get('community')
        # Only enforce community membership on create, or if changing community
        if request and request.method == 'POST':
            if community is not None:
                from apps.communities.models import CommunityMember
                if not CommunityMember.objects.filter(user=user, community=community, is_active=True).exists():
                    raise serializers.ValidationError('You must be a member of the selected community to post.')
        elif request and request.method in ['PUT', 'PATCH']:
            # On update, only check if changing community
            instance = getattr(self, 'instance', None)
            if instance and community is not None and instance.community_id != (community.id if hasattr(community, 'id') else community):
                from apps.communities.models import CommunityMember
                if not CommunityMember.objects.filter(user=user, community=community, is_active=True).exists():
                    raise serializers.ValidationError('You must be a member of the selected community to post.')
        return attrs

    def validate_image(self, value):
        if value == '' or value is None:
            return None
        return value


class CommentSerializer(serializers.ModelSerializer):
    """
    Serializer for Comment model
    """
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_at', 'author', 'author_name', 'post']
        read_only_fields = ['id', 'created_at', 'author', 'author_name', 'post']


class LikeSerializer(serializers.ModelSerializer):
    """
    Serializer for Like model
    """
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Like
        fields = ['id', 'user', 'user_name', 'post', 'created_at']
        read_only_fields = ['id', 'user', 'user_name', 'post', 'created_at']


class PostDetailSerializer(PostSerializer):
    """
    Post Detail Serializer with nested comments
    """
    comments = CommentSerializer(many=True, read_only=True)
    like_count = serializers.IntegerField(read_only=True)

    class Meta(PostSerializer.Meta):
        fields = PostSerializer.Meta.fields + ['comments'] 