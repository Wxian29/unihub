from rest_framework.permissions import BasePermission

class IsCommunityAdmin(BasePermission):
    """
    Only global admin, community_leader, or superuser have permission
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        # Global admin or community_leader has permission
        if hasattr(request.user, 'role') and request.user.role in ['admin', 'community_leader']:
            return True
        admin_membership = obj.members.filter(user=request.user, role='admin', is_active=True).exists()
        if admin_membership:
            return True
        return False 