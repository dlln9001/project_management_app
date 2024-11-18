from rest_framework import serializers
from user_authentication.api.serializers import SummaryUserSerializer
from ..models import Board
from ..models import Group
from ..models import Item
from ..models import Column
from ..models import ColumnValue
from ..models import BoardView
from ..models import ItemUpdate

class BoardSummarySerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Board
        fields = ['name', 'type', 'id', 'order']

class BoardFullSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Board
        fields = ['name', 'type', 'id', 'created_at', 'user', 'description']

class BoardViewSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = BoardView
        fields = ['name', 'type', 'order', 'id']

class GroupSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Group
        fields = ['name', 'id', 'order', 'color']

class ItemSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Item
        fields = ['name', 'id', 'order', 'group']

class ColumnSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Column
        fields = ['name', 'column_type', 'id', 'order']

class ColumnValueSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = ColumnValue
        fields = ['value_text', 'value_color', 'value_date', 'value_person', 'value_number', 'item', 'column', 'id']

class ItemUpdateSerializer(serializers.ModelSerializer):
    author = SummaryUserSerializer()
    class Meta(object):
        model = ItemUpdate
        fields = ['id', 'author', 'content', 'created_at']