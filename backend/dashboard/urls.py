from django.urls import path
from .views import (
    dashboard_summary,
    enrollment_statistics,
    role_wise_user_count
)

urlpatterns = [
    path('summary/', dashboard_summary),
    path('enrollments/', enrollment_statistics),
    path('roles/', role_wise_user_count),
]
