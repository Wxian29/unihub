from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, login, logout as django_logout, authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from .models import User, Profile
from .serializers import (
    UserSerializer, ProfileSerializer, RegisterSerializer, LoginSerializer
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """Register View"""
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class LoginView(generics.GenericAPIView):
    """Login View"""
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })


class UserProfileView(generics.RetrieveUpdateAPIView):
    """User Profile View"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class ProfileDetailView(generics.RetrieveUpdateAPIView):
    """Profile Detail View"""
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout(request):
    """User logout view"""
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
    except Exception:
        return Response({"message": "Logout failed"}, status=status.HTTP_400_BAD_REQUEST) 


class SessionLoginView(APIView):
    """
    Login view using Django session authentication.
    Accepts email and password, logs in user and creates session.
    """
    permission_classes = [permissions.AllowAny]

    @csrf_exempt
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=email, password=password)
        if user is not None and user.is_active:
            # Flush any existing session to prevent session fixation
            request.session.flush()
            login(request, user)
            return Response({'message': 'Session login successful'}, status=status.HTTP_200_OK)
        return Response({'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class SessionLogoutView(APIView):
    """
    Logout view for Django session authentication.
    Logs out the user and clears the session.
    """
    permission_classes = [permissions.IsAuthenticated]

    @csrf_exempt
    def post(self, request):
        django_logout(request)
        return Response({'message': 'Session logout successful'}, status=status.HTTP_200_OK) 