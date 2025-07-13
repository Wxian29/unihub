from rest_framework import serializers
from .models import Community, CommunityMember
from apps.posts.models import Post


class PostSerializer(serializers.ModelSerializer):
    """Post Serializers"""
    author_name = serializers.CharField(source='author.username', read_only=True)
    author_avatar = serializers.CharField(source='author.avatar', read_only=True)
    
    class Meta:
        model = Post
        fields = ['id', 'content', 'author', 'author_name', 'author_avatar', 'image', 'created_at']
        read_only_fields = ['author', 'created_at']


class CommunitySerializer(serializers.ModelSerializer):
    """Community Serializer"""
    creator_name = serializers.CharField(source='creator.username', read_only=True)
    member_count = serializers.SerializerMethodField()
    current_user_role = serializers.SerializerMethodField()
    
    class Meta:
        model = Community
        fields = [
            'id', 'name', 'description', 'creator', 'creator_name',
            'avatar', 'cover_image', 'is_public', 'max_members',
            'member_count', 'created_at', 'updated_at', 'current_user_role'
        ]
        read_only_fields = ['creator', 'created_at', 'updated_at']
    
    def get_member_count(self, obj):
        return obj.members.filter(is_active=True).count()
    def get_current_user_role(self, obj):
        user = self.context.get('request').user
        if not user or not user.is_authenticated:
            return None
        if user.is_superuser:
            return 'admin'
        membership = obj.members.filter(user=user, is_active=True).first()
        if membership:
            return membership.role
        return None


class CommunityMemberSerializer(serializers.ModelSerializer):
    """Community Member Serializer"""
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_avatar = serializers.CharField(source='user.avatar', read_only=True)
    
    class Meta:
        model = CommunityMember
        fields = ['id', 'user', 'user_name', 'user_avatar', 'role', 'joined_at', 'is_active']
        read_only_fields = ['joined_at']


class CommunityDetailSerializer(CommunitySerializer):
    """Community Details Serializer"""
    members = CommunityMemberSerializer(many=True, read_only=True)
    posts = PostSerializer(many=True, read_only=True)
    
    class Meta(CommunitySerializer.Meta):
        fields = CommunitySerializer.Meta.fields + ['members', 'posts'] 