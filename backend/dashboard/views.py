from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from accounts.models import User
from lms.models import Course, Enrollment


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_summary(request):
    return Response({
        "total_users": User.objects.count(),
        "total_courses": Course.objects.count(),
        "total_enrollments": Enrollment.objects.count(),
        "role_wise_users": {
            "admin": User.objects.filter(role='admin').count(),
            "instructor": User.objects.filter(role='instructor').count(),
            "student": User.objects.filter(role='student').count(),
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def enrollment_statistics(request):
    data = []
    for course in Course.objects.all():
        data.append({
            "course_id": course.id,
            "course_title": course.title,
            "total_enrollments": Enrollment.objects.filter(course=course).count()
        })
    return Response(data)


# 🔥 THIS FUNCTION WAS MISSING
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def role_wise_user_count(request):
    return Response({
        "admin": User.objects.filter(role='admin').count(),
        "instructor": User.objects.filter(role='instructor').count(),
        "student": User.objects.filter(role='student').count(),
    })
