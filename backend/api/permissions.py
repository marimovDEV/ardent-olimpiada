from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'ADMIN')


class IsTeacher(permissions.BasePermission):
    """
    Allows access to teachers.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'TEACHER')


class IsTeacherOrAdmin(permissions.BasePermission):
    """
    Allows access to teachers or admins.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in ['ADMIN', 'TEACHER']


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute or `teacher` attribute.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        # if request.method in permissions.SAFE_METHODS:
        #     return True

        if request.user.role == 'ADMIN':
            return True

        # Check for 'teacher' field
        if hasattr(obj, 'teacher'):
            return obj.teacher == request.user
            
        # Check for 'user' field (e.g., Profile)
        if hasattr(obj, 'user'):
            return obj.user == request.user
            
        return False
