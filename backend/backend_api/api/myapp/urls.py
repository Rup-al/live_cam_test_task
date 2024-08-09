from django.urls import path
from .views import RegisterView, LoginView, LogoutView, CameraListView, AngelcamTokenView, RecordingControlView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('cameras/', CameraListView.as_view(), name='camera-list'),
    path('angelcamtoken/', AngelcamTokenView.as_view(), name='angelcam_token'),
    path('recording/control/', RecordingControlView.as_view(), name='recording-control'),
]
