from django.urls import path
from .views import RegisterView, LoginView, LogoutView, CameraListView, AngelcamTokenView, RecordingControlView, ForgotPasswordView, PasswordResetConfirmView, ValidateResetTokenView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('cameras/', CameraListView.as_view(), name='camera-list'),
    path('angelcamtoken/', AngelcamTokenView.as_view(), name='angelcam_token'),
    path('recording/control/', RecordingControlView.as_view(), name='recording-control'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password-confirm/', PasswordResetConfirmView.as_view(), name='reset-password-confirm'),
    path('validate-reset-token/', ValidateResetTokenView.as_view(), name='validate-reset-token'),
]
