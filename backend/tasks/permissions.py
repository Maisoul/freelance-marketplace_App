from rest_framework import permissions

class IsExpertOrClientOfTask(permissions.BasePermission):
    """
    Custom permission to only allow:
    1. Experts to create submissions and view their own submissions
    2. Clients to view submissions for their tasks
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow full access to admin users
        if request.user.is_staff:
            return True
            
        # Check if user is the expert who submitted
        if obj.expert == request.user:
            # Expert can only view their submissions
            if request.method in permissions.SAFE_METHODS:
                return True
            # Expert can create new submissions
            if request.method == 'POST':
                return True
            return False

        # Check if user is the client who owns the task
        if obj.task.client == request.user:
            return True

        return False