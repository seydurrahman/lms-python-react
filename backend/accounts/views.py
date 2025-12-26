from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.http import (
    urlsafe_base64_encode,
    urlsafe_base64_decode
)
from django.utils.encoding import force_bytes, force_str
from django.conf import settings
from django.shortcuts import get_object_or_404

from .models import User
from .serializers import (
    RegisterSerializer,
    MyTokenObtainPairSerializer,
    ProfileSerializer
)
from .permissions import IsAdmin


# =================================================
# USER REGISTRATION (PUBLIC)
# =================================================
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully"})

    return Response(serializer.errors, status=400)


# =================================================
# JWT LOGIN (PUBLIC)
# =================================================
class MyTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = MyTokenObtainPairSerializer


# =================================================
# FORGOT PASSWORD (PUBLIC)
# =================================================
@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    email = request.data.get("email")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Prevent email enumeration
        return Response(
            {"message": "If the email exists, a reset link has been sent"}
        )

    token = PasswordResetTokenGenerator().make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))

    reset_link = f"http://localhost:5173/reset-password/{uid}/{token}/"

    html_content = render_to_string(
        "emails/password_reset.html",
        {
            "user": user,
            "reset_link": reset_link,
        }
    )

    email_message = EmailMultiAlternatives(
        subject="Password Reset Request",
        body="Password Reset",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[email],
    )
    email_message.attach_alternative(html_content, "text/html")
    email_message.send()

    return Response(
        {"message": "If the email exists, a reset link has been sent"}
    )


# =================================================
# RESET PASSWORD (PUBLIC)
# =================================================
@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_confirm(request, uid, token):
    try:
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)
    except Exception:
        return Response({"message": "Invalid reset link"}, status=400)

    if not PasswordResetTokenGenerator().check_token(user, token):
        return Response({"message": "Invalid or expired token"}, status=400)

    password = request.data.get("password")

    if not password:
        return Response({"message": "Password is required"}, status=400)

    user.set_password(password)
    user.save()

    return Response({"message": "Password reset successful"})


# =================================================
# VIEW PROFILE (AUTH REQUIRED)
# =================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_profile(request):
    serializer = ProfileSerializer(request.user)
    return Response(serializer.data)


# =================================================
# UPDATE PROFILE (AUTH REQUIRED)
# =================================================
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    serializer = ProfileSerializer(
        request.user,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)


# =================================================
# ROLE-SPECIFIC PROFILE DATA (AUTH REQUIRED)
# =================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def role_profile(request):
    user = request.user
    data = ProfileSerializer(user).data

    if user.role == 'student':
        from lms.models import Enrollment
        data['enrolled_courses'] = Enrollment.objects.filter(
            student=user
        ).count()

    elif user.role == 'instructor':
        from lms.models import Course
        data['my_courses'] = Course.objects.filter(
            instructor=user
        ).count()

    elif user.role == 'admin':
        data['total_users'] = User.objects.count()

    return Response(data)


# =================================================
# CHANGE PASSWORD (AUTH REQUIRED)
# =================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    password = request.data.get("password")

    if not password:
        return Response({"message": "Password is required"}, status=400)

    user = request.user
    user.set_password(password)
    user.save()

    return Response({"message": "Password changed successfully"})


# =================================================
# ADMIN: LIST USERS
# =================================================
@api_view(['GET'])
@permission_classes([IsAdmin])
def user_list(request):
    users = User.objects.all().values(
        'id',
        'username',
        'email',
        'role'
    )
    return Response(users)


# =================================================
# ADMIN: UPDATE USER ROLE
# =================================================
@api_view(['PUT'])
@permission_classes([IsAdmin])
def update_user_role(request, pk):
    user = get_object_or_404(User, pk=pk)

    role = request.data.get("role")

    if role not in ['admin', 'instructor', 'student']:
        return Response({"message": "Invalid role"}, status=400)

    user.role = role
    user.save()

    return Response({"message": "User role updated successfully"})
