from rest_framework import serializers
from ..models import RecentlyVisited


class RecentlyVisitedSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = RecentlyVisited
        fields = ['visited_at']
