from django.utils.deprecation import MiddlewareMixin
from .models import InvalidatedToken
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.tokens import AccessToken

class TokenValidationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', None)
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                access_token = AccessToken(token)
                if InvalidatedToken.objects.filter(token=token).exists():
                    raise InvalidToken('Token is invalidated')
            except InvalidToken as e:
                return JsonResponse({'error': str(e)}, status=401)
