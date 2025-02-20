from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token
from urllib.parse import parse_qs
from asgiref.sync import sync_to_async

@sync_to_async
def get_user(token_key):
    try:
        token = Token.objects.get(key=token_key)
        return token.user
    except Token.DoesNotExist:
        return AnonymousUser()

class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Get the query string parameters
        query_string = parse_qs(scope["query_string"].decode())
        token_key = query_string.get("token", [None])[0]

        # Authenticate the user
        scope["user"] = await get_user(token_key)

        return await super().__call__(scope, receive, send)
