from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.db.models import Q
from ..models import Workspace
from .serializers import WorkspaceSerializer
from .serializers import WorkspaceDetailedSerializer
from user_authentication.api.serializers import SummaryUserSerializer
from notifications.models import Notifications


@api_view(['GET', 'POST'])
def get_workspace(request):
    try:
        workspaces = Workspace.objects.filter(Q(author=request.user) | Q(members=request.user)).distinct()

        workspace_serialized = WorkspaceSerializer(workspaces, many=True)
        return Response({'status': 'success', 'workspace_data': workspace_serialized.data}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'status': f'error {e}'})


@api_view(['GET', 'POST'])
def create_workspace(request):
    try:
        workspace = Workspace.objects.create(author=request.user, name=request.data['workspace_name'], is_main=False)
        workspace.members.add(request.user)
        return Response({'status': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'status': f'error {e}'})


@api_view(['DELETE'])
def delete_workspace(request, id):
    try:
        workspace = Workspace.objects.get(id=id)
        if workspace.is_main:
            raise Exception('Cannot delete main workspace')
        if workspace.author == request.user:
            workspace.delete()
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'status': f'error {e}'})


@api_view(['GET', "POST"])
def change_workspace_name(request):
    try:
        workspace = Workspace.objects.get(id=request.data['workspace_id'])
        workspace.name = request.data['workspace_name']
        workspace.save()
        return Response({'status': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'status': f'error {e}'})


@api_view(['GET'])
def get_extra_information(request, id):
    try:
        workspace = Workspace.objects.get(id=id)
        workspace_serialized = WorkspaceDetailedSerializer(workspace)
        return Response({'status': 'success', 'workspaceInfo': workspace_serialized.data}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'status': f'error {e}'})


@api_view(['POST'])
def change_description(request):
    try:
        workspace = Workspace.objects.get(id=request.data['workspace_id'])
        workspace.description = request.data['description']
        workspace.save()
        return Response({'status': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'status': f'error {e}'})


@api_view(['POST'])
def change_color(request):
    try:
        workspace = Workspace.objects.get(id=request.data['workspace_id'])
        workspace.color = request.data['color']
        workspace.save()
        return Response({'status': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'status': f'error {e}'})


@api_view(['GET'])
def get_members(request, id):
    try:
        workspace = Workspace.objects.get(id=id)
        members = workspace.members
        members_serialized = SummaryUserSerializer(members, many=True)
        return Response({'status': 'success', 'membersInfo': members_serialized.data}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'status': f'error {e}'})


@api_view(['POST'])
def leave_workspace(request):
    try:
        if request.data['author_id'] != request.user.id:
            workspace = Workspace.objects.get(id=request.data['workspace_id'])
            workspace.members.remove(request.user)

            workspace_author = workspace.author

            # do websocket, notify the workspace author when a member leaves their workspace
            notification = Notifications.objects.create(user=workspace_author, message=f'{request.user.email} left your workspace', type='member left workspace')
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send) (
                f'notifications_user_{workspace_author.id}',
                {
                    'type': 'send_notification',
                    'message': {
                        'type': 'notification',
                        'notification_type': 'member left workspace',
                        'message': f'{request.user.email} left your workspace',
                        'notification_id': notification.id
                    }
                }
            )

            return Response({'status': 'success'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'error'})
    except Exception as e:
        print(e)
        return Response({'status': 'error'})