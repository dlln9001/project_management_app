from rest_framework import serializers
from ..models import Document

class DocumentSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Document
        fields = ['title', 'content', 'created_at', 'updated_at', 'author', 'id', 'order', 'type']
