from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Notifications
from .serializers import NotificationsSerializer

@api_view(['GET'])
def get_unread_notifications(request):
    try:
        unread_notifications = Notifications.objects.filter(user=request.user, is_read=False)
        unread_notifications_serialized = NotificationsSerializer(unread_notifications, many=True)
        return Response({'status': 'success', 'unread_notifications': unread_notifications_serialized.data}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'status': 'error'})


@api_view(['GET'])
def get_all_notifications(request):
    try:
        notifications = Notifications.objects.filter(user=request.user)
        notifications_serialized = NotificationsSerializer(notifications, many=True)
        return Response({'status': 'success', 'notifications': notifications_serialized.data}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'status': 'error'})
    

@api_view(['POST'])
def mark_read(request, id):
    try:
        notification = Notifications.objects.get(id=id)
        notification.is_read = True
        notification.save()

        notifications = Notifications.objects.filter(user=request.user)
        notifications_serialized = NotificationsSerializer(notifications, many=True)
        return Response({'status': 'success', 'notifications': notifications_serialized.data}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'status': 'success'})
    

@api_view(['DELETE'])
def delete(request, id):
    try:
        notification = Notifications.objects.get(id=id)
        notification.delete()
        return Response({'status': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'status': 'success'})