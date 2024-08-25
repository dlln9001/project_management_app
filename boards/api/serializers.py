from rest_framework import serializers
from ..models import Board

class BoardSummarySerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Board
        fields = ['name', 'type', 'id']

class BoardFullSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Board
        fields = ['name', 'type', 'id']