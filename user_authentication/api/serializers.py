from rest_framework import serializers
from ..models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = ['id', 'username', 'name', 'email', 'profile_picture', 'is_default_profile_picture', 'google_id']

class SummaryUserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = ['id', 'username', 'name', 'email', 'profile_picture', 'is_default_profile_picture']