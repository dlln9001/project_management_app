from rest_framework import serializers
from ..models import Notifications

class NotificationsSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Notifications
        fields = ['id', 'message', 'type', 'is_read', 'created_at']
