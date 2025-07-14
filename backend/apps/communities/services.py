"""
communities/services.py
Business logic for community creation, member management, and role assignment.
"""

from .models import Community, CommunityMember
from django.contrib.auth import get_user_model
from apps.notifications.services import create_notification

User = get_user_model()

def create_community(validated_data, creator):
    """
    Create a new community and assign the creator as the community leader.
    Args:
        validated_data (dict): Community data.
        creator (User): The user creating the community.
    Returns:
        community (Community): The created community instance.
    """
    community = Community.objects.create(**validated_data, creator=creator)
    CommunityMember.objects.create(user=creator, community=community, role='community_leader')
    return community

def add_member(community, user, role='member'):
    """
    Add a user to a community with a specific role and send notification.
    Args:
        community (Community): The community instance.
        user (User): The user to add.
        role (str): Role to assign.
    Returns:
        member (CommunityMember): The member instance.
    """
    member, created = CommunityMember.objects.get_or_create(user=user, community=community, defaults={'role': role})
    if not created:
        member.role = role
        member.save()
    # Send notification
    create_notification(user, f"You have been added to the community '{community.name}' as {role}.")
    return member

def remove_member(community, user):
    """
    Remove a user from a community.
    Args:
        community (Community): The community instance.
        user (User): The user to remove.
    Returns:
        bool: True if removed, False otherwise.
    """
    try:
        member = CommunityMember.objects.get(user=user, community=community)
        member.delete()
        return True
    except CommunityMember.DoesNotExist:
        return False

def change_member_role(community, user, new_role):
    """
    Change the role of a community member.
    Args:
        community (Community): The community instance.
        user (User): The user whose role to change.
        new_role (str): The new role to assign.
    Returns:
        member (CommunityMember): The updated member instance.
    """
    member = CommunityMember.objects.get(user=user, community=community)
    member.role = new_role
    member.save()
    return member 