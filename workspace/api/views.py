from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.db.models import Q
from ..models import Workspace
from .serializers import WorkspaceSerializer
from .serializers import WorkspaceDetailedSerializer
from user_authentication.api.serializers import SummaryUserSerializer


@api_view(['GET', 'POST'])
def get_workspace(request):
    try:
        workspaces = Workspace.objects.filter(Q(author=request.user) | Q(members=request.user))

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
        else:
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