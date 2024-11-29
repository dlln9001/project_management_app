from rest_framework import serializers 
from ..models import Workspace, WorkspaceInvite
from user_authentication.api.serializers import SummaryUserSerializer

class WorkspaceSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Workspace
        fields = ['id', 'name', 'author', 'is_main', 'color']

class WorkspaceDetailedSerializer(serializers.ModelSerializer):
        class Meta(object):
            model = Workspace
            fields = ['id', 'name', 'author', 'is_main', 'members', 'color', 'cover_color', 'description']

class WorkspaceInviteSerializer(serializers.ModelSerializer):
     sender = SummaryUserSerializer()
     receiver = SummaryUserSerializer()
     workspace = WorkspaceSerializer()
     class Meta(object):
          model=WorkspaceInvite
          fields = ['id', 'sender', 'receiver', 'status', 'workspace', 'created_at']