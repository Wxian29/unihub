from rest_framework.permissions import BasePermission

class IsCommunityAdmin(BasePermission):
    """
    Only community administrators, admins or super administrators have permission
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        # Check whether the user has the admin role
        admin_membership = obj.members.filter(user=request.user, role='admin', is_active=True).exists()
        if admin_membership:
            return True
        # Check if it is the community_leader role
        return obj.members.filter(user=request.user, role='community_leader', is_active=True).exists() 