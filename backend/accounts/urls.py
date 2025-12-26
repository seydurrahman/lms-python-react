from django.urls import path
from .views import (
    register,
    forgot_password,
    reset_password_confirm,
    user_list,
    view_profile,
    update_profile,
    role_profile,
    change_password,
    update_user_role,
    MyTokenObtainPairView,
)

urlpatterns = [
    # AUTH
    path("register/", register),
    path("login/", MyTokenObtainPairView.as_view()),

    # PASSWORD
    path("forgot-password/", forgot_password),
    path("reset-password/<uid>/<token>/", reset_password_confirm),

    # PROFILE
    path("profile/", view_profile),
    path("profile/update/", update_profile),   # ✅ FIXED
    path("profile/role/", role_profile),       # ✅ FIXED

    # PASSWORD CHANGE
    path("change-password/", change_password),

    # ADMIN
    path("users/", user_list),
    path("users/<int:pk>/role/", update_user_role),
]
