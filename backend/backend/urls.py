from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/accounts/", include("accounts.urls")),
    path("api/lms/", include("lms.urls")),
    path("api/dashboard/", include("dashboard.urls")),

    # 🔥 JWT REFRESH ENDPOINT (REQUIRED)
    path("api/accounts/token/refresh/", TokenRefreshView.as_view()),
]


# from django.contrib import admin
# from django.urls import path, include

# urlpatterns = [
#     path('admin/', admin.site.urls),

#     # 🔥 API ROOT
#     path('api/accounts/', include('accounts.urls')),
#     path('api/', include('lms.urls')),
#     path('api/dashboard/', include('dashboard.urls')),
# ]
