from rest_framework import serializers
from .models import Community, CommunityMember, InterestTag
from apps.posts.models import Post
from apps.posts.serializers import PostSerializer
from apps.users.serializers import UserSerializer


class InterestTagSerializer(serializers.ModelSerializer):
    """Serializer for Interest Tags"""
    class Meta:
        model = InterestTag
        fields = ['id', 'name', 'description', 'color', 'created_at']
        read_only_fields = ['created_at']


class CommunitySerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    member_count = serializers.ReadOnlyField()
    # Make tags writable: use PrimaryKeyRelatedField for editing
    tags = serializers.PrimaryKeyRelatedField(queryset=InterestTag.objects.all(), many=True)
    
    class Meta:
        model = Community
        fields = ['id', 'name', 'description', 'creator', 'is_public', 'created_at', 'updated_at', 'cover_image', 'member_count', 'tags']
        read_only_fields = ['created_at', 'updated_at', 'member_count']


class CommunityMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    community = CommunitySerializer(read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = CommunityMember
        fields = ['id', 'user', 'community', 'role', 'joined_at', 'is_active', 'user_name', 'user_email']
        read_only_fields = ['joined_at']


class CommunityDetailSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    members = serializers.SerializerMethodField()
    member_count = serializers.ReadOnlyField()
    # Make tags writable: use PrimaryKeyRelatedField for editing
    tags = serializers.PrimaryKeyRelatedField(queryset=InterestTag.objects.all(), many=True)
    creator_name = serializers.CharField(source='creator.username', read_only=True)
    current_user_role = serializers.SerializerMethodField()
    
    class Meta:
        model = Community
        fields = ['id', 'name', 'description', 'creator', 'creator_name', 'is_public', 'created_at', 'updated_at', 'cover_image', 'members', 'member_count', 'tags', 'current_user_role']
        read_only_fields = ['created_at', 'updated_at', 'member_count']
    
    def get_members(self, obj):
        # Only return active members
        active_members = obj.members.filter(is_active=True)
        return CommunityMemberSerializer(active_members, many=True).data
    
    def get_current_user_role(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            member = obj.members.filter(user=request.user, is_active=True).first()
            return member.role if member else None
        return None


class PostSerializer(serializers.ModelSerializer):
    """Post Serializer for Community Posts"""
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'created_at', 'updated_at']
        read_only_fields = ['author', 'created_at'] 