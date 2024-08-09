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
import requests
from dateutil import parser
import environ

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
            
            # Add custom claims
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
    #permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        action = request.data.get("action")
        speed = request.data.get("speed")
        recording_id = request.data.get("recording_id")
        start = request.data.get("start")
        cleaned_start = start.strip('"')
        print(cleaned_start)


        if not recording_id:
            return Response({"error": "Recording ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        apiUrl = env('APP_GET_ALL_SHARED_CAMERAS_API', default='default_get_all_shared_cameras_api')
        base_url = f"{apiUrl}{recording_id}/recording/stream/?start={cleaned_start}"

        print(base_url)
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