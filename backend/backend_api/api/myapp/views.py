from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework.permissions import IsAuthenticated
from .models import InvalidatedToken
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password
from django.urls import reverse
from django.conf import settings
from .models import InvalidatedToken
from django.core.mail import send_mail
import jwt
import requests
from dateutil import parser
import environ
from rest_framework import serializers
from django.contrib.auth.tokens import default_token_generator
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str

env = environ.Env()
environ.Env.read_env()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class LoginView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            access_token['username'] = user.username
            access_token['email'] = user.email

            return Response({
                'refresh': str(refresh),
                'access': str(access_token),
            })
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(generics.GenericAPIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token is None:
                return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
            token = RefreshToken(refresh_token)
        
            InvalidatedToken.objects.create(token=str(token))
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CameraListView(generics.GenericAPIView):
    
    permission_classes = [IsAuthenticated]

    def get(self, request):

        token = env('APP_PERSONAL_ACCESS_TOKEN', default='default_personal_access_token')
        headers = {
            "Authorization": f"PersonalAccessToken {token}",
        }
        apiUrl = env('APP_GET_ALL_SHARED_CAMERAS_API', default='default_get_all_shared_cameras_api')
        response = requests.get(apiUrl, headers=headers)
        cameras = response.json()
        return Response(cameras)

class AngelcamTokenView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        client_id = env('CLIENT_ID', default='default_client_id')
        apiUrl = env('APP_GET_ANGELCAM_USER_AUTH_API', default='default_get_angelcam_user_auth_api')
        url = apiUrl

        username = request.data.get('username')
        password = request.data.get('password')

        response = requests.post(url, data={
            'client_id': client_id,
            'scope': 'user_access',
            'grant_type': 'password',
            'username': username,
            'password': password
        })

        return JsonResponse(response.json(), status=response.status_code)

 
class RecordingControlView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        action = request.data.get("action")
        speed = request.data.get("speed")
        recording_id = request.data.get("recording_id")
        start = request.data.get("start")
        cleaned_start = start.strip('"')


        if not recording_id:
            return Response({"error": "Recording ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        apiUrl = env('APP_GET_ALL_SHARED_CAMERAS_API', default='default_get_all_shared_cameras_api')
        base_url = f"{apiUrl}{recording_id}/recording/stream/?start={cleaned_start}"

        actions = {
            "play": f"{base_url}play/",
            "pause": f"{base_url}pause/",
            "speed": f"{base_url}speed/"
        }
        
        # if action not in actions:
        #     return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

        # url = actions[action]
        # data = {}
        # if action == "speed" and speed is not None:
        #     data['speed'] = speed
        
        # Include the Authorization token
        token = env('APP_PERSONAL_ACCESS_TOKEN', default='default_personal_access_token')
        headers = {
            "Authorization": f"PersonalAccessToken {token}",
        }

        response = requests.get(base_url , headers=headers)

        return JsonResponse(response.json(), status=response.status_code) 

class ForgotPasswordView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            refresh = RefreshToken.for_user(user)
            token = str(refresh.access_token)

            reset_url = "http://localhost:3000/reset-password-confirm" + f"?token={token}"
            

            send_mail(
                'Password Reset Request',
                f'Click the link to reset your password: {reset_url}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
            )

            return Response({"detail": "Password reset email sent."}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"detail": "User with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)      


class PasswordResetConfirmView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        token = request.data.get('token')
        password = request.data.get('password')


        if not token or not password:
            return Response({'error': 'Token and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

            user_id = payload.get('user_id')
            user = User.objects.get(pk=user_id)
        except jwt.ExpiredSignatureError as e:
            return Response({'error': 'Token has expired.'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.DecodeError as e:
            return Response({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist as e:
            return Response({'error': 'User does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(password)
        user.save()

        return Response({'success': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)


class ValidateResetTokenView(generics.GenericAPIView):
    def post(self, request):
        token = request.data.get('token')

        try:
            
            UntypedToken(token)
            return Response({'valid': True}, status=status.HTTP_200_OK)
        except (InvalidToken, TokenError):
            return Response({'valid': False}, status=status.HTTP_400_BAD_REQUEST)