from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .models import Course, Enrollment, Category
from .serializers import CourseSerializer, CategorySerializer


# =================================================
# COURSE CATEGORY MANAGEMENT (ADMIN ONLY)
# =================================================
class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role != 'admin':
            raise PermissionDenied("Only admin can manage categories")
        serializer.save()

    def perform_update(self, serializer):
        if self.request.user.role != 'admin':
            raise PermissionDenied("Only admin can manage categories")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role != 'admin':
            raise PermissionDenied("Only admin can manage categories")
        instance.delete()


# =================================================
# COURSE MANAGEMENT (ADMIN / INSTRUCTOR)
# =================================================
class CourseViewSet(ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Admin → all courses
        Instructor → own courses
        Student → no access
        """
        user = self.request.user

        if user.role == 'admin':
            return Course.objects.all()

        if user.role == 'instructor':
            return Course.objects.filter(instructor=user)

        if user.role == 'student':
            return Course.objects.all()

        return Course.objects.none()

    def perform_create(self, serializer):
        """
        Only Admin & Instructor can create courses
        """
        if self.request.user.role not in ['admin', 'instructor']:
            raise PermissionDenied("Only instructors or admins can create courses")

        serializer.save(instructor=self.request.user)

    def perform_update(self, serializer):
        """
        Instructor → own course
        Admin → any course
        """
        course = self.get_object()

        if (
            self.request.user != course.instructor
            and self.request.user.role != 'admin'
        ):
            raise PermissionDenied("You cannot edit this course")

        serializer.save()

    def perform_destroy(self, instance):
        """
        Instructor → own course
        Admin → any course
        """
        if (
            self.request.user != instance.instructor
            and self.request.user.role != 'admin'
        ):
            raise PermissionDenied("You cannot delete this course")

        instance.delete()


# =================================================
# STUDENT ENROLLMENT SYSTEM
# =================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll(request, course_id):
    """
    Only students can enroll
    Prevent duplicate enrollment
    """
    if request.user.role != 'student':
        return Response(
            {"message": "Only students can enroll in courses"},
            status=403
        )

    course = get_object_or_404(Course, id=course_id)

    if Enrollment.objects.filter(student=request.user, course=course).exists():
        return Response(
            {"message": "Already enrolled in this course"},
            status=400
        )

    Enrollment.objects.create(
        student=request.user,
        course=course
    )

    return Response({"message": "Enrolled successfully"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_enrollments(request):
    """
    Student → see enrolled courses
    """
    if request.user.role != 'student':
        return Response(
            {"message": "Only students can view enrollments"},
            status=403
        )

    enrollments = Enrollment.objects.filter(student=request.user)
    courses = [en.course for en in enrollments]

    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)