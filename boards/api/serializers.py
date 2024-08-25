from rest_framework import serializers
from ..models import Board
from ..models import Group

class BoardSummarySerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Board
        fields = ['name', 'type', 'id']

class BoardFullSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Board
        fields = ['name', 'type', 'id']

class GroupSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Group
        fields = ['name', 'id']