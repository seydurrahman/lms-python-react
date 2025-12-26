from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User


# =================================================
# USER REGISTRATION SERIALIZER
# =================================================
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
            role=validated_data.get('role', 'student')
        )
        return user


# =================================================
# JWT LOGIN SERIALIZER (CUSTOM + STABLE)
# =================================================
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        # 🔐 Perform default authentication
        data = super().validate(attrs)

        # 🔥 Attach user info for frontend
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'role': self.user.role,
        }

        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # 🔥 Add custom claims inside JWT
        token['role'] = user.role
        token['username'] = user.username

        return token


# =================================================
# PROFILE SERIALIZER
# =================================================
class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'role',
            'first_name',
            'last_name',
        ]
        read_only_fields = [
            'id',
            'username',
            'role',
        ]
