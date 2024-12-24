"""
ASGI config for project_management_app project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
import django

django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from user_authentication.middleware import TokenAuthMiddleware
import notifications.api.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_management_app.settings')

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': TokenAuthMiddleware(
        URLRouter(
            notifications.api.routing.websocket_urlpatterns
        )
    )
})
