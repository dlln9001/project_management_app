from rest_framework import serializers 
from ..models import Workspace

class WorkspaceSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Workspace
        fields = ['id', 'name', 'author', 'is_main', 'members', 'color']

class WorkspaceDetailedSerializer(serializers.ModelSerializer):
        class Meta(object):
            model = Workspace
            fields = ['id', 'name', 'author', 'is_main', 'members', 'color']