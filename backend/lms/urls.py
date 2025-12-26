from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, CategoryViewSet, enroll, my_enrollments

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='courses')
router.register(r'categories',CategoryViewSet)

urlpatterns = [
    # Course CRUD APIs
    path('', include(router.urls)),

    # Enrollment API
    path('enroll/<int:course_id>/', enroll, name='course-enroll'),
    path("my-enrollments/",my_enrollments)
]
