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


class HasCourseAccess(permissions.BasePermission):
    """
    Checks if the user has access to a course (purchased, teacher, or admin).
    """
    def has_permission(self, request, view):
        """Obyektsiz amallar (list, create) uchun tekshiruv.

        Bu metod ilgari yo'q edi. DRF `has_object_permission` ni faqat
        `get_object()` chaqirilganda ishlatadi, shuning uchun POST
        (create) hech qanday tekshiruvdan o'tmasdi: oddiy o'quvchi
        `/api/lesson-tests/` ga POST qilib, ISTALGAN darsga test
        qo'shib yuborishi mumkin edi.
        """
        user = request.user
        if not user or not user.is_authenticated:
            return False

        if request.method in permissions.SAFE_METHODS:
            return True

        # Detal amallar (`/<id>/...`) `get_object()` ni chaqiradi, ya'ni
        # pastdagi `has_object_permission` ularni tekshiradi. O'quvchining
        # `complete_video` / `submit_test` kabi POST amallari aynan shunday,
        # shuning uchun ularga to'sqinlik qilmaymiz.
        if getattr(view, 'detail', False):
            return True

        # Qolgani — obyektsiz yaratish (POST /lesson-tests/ kabi). Bu yo'lda
        # hech qanday obyekt tekshiruvi bo'lmaydi, shuning uchun faqat
        # o'qituvchi va adminga ruxsat beramiz.
        return user.role in ['ADMIN', 'TEACHER'] or user.is_staff

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        
        if user.role == 'ADMIN' or user.is_staff:
            return True
            
        # Get course from object
        course = None
        if hasattr(obj, 'course'):
            course = obj.course
        elif hasattr(obj, 'lesson'):
            course = obj.lesson.course
        elif hasattr(obj, 'homework'):
            course = obj.homework.lesson.course
        elif hasattr(obj, 'module'):
            course = obj.module.course
        elif hasattr(obj, 'lesson_tests'): # Special for TestResult/Submission
             # Check if it has a reference to course
             course = getattr(obj, 'course', None)
        
        # If obj is Course itself
        from .models import Course
        if isinstance(obj, Course):
            course = obj
            
        if not course:
            return True # Fallback if no course context

        # Bepul (tanishtiruv) dars hammaga ochiq. Modelda `is_free` bor va
        # LearningService uni qulfdan chiqaradi, lekin bu tekshiruv faqat
        # yozilganlarni o'tkazardi — ya'ni "bepul dars" amalda yopiq edi.
        if getattr(obj, 'is_free', False):
            return True
        lesson = getattr(obj, 'lesson', None)
        if lesson is not None and getattr(lesson, 'is_free', False):
            return True

        # Teachers see their own courses
        if user.role == 'TEACHER' and course.teacher == user:
            return True
            
        # Check if student is enrolled
        from .models import Enrollment
        return Enrollment.objects.filter(user=user, course=course).exists()
