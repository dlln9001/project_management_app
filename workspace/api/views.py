from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.db.models import Q
from ..models import Workspace
from .serializers import WorkspaceSerializer

@api_view(['GET', 'POST'])
def get_workspace(request):
    try:
        workspaces = Workspace.objects.filter(Q(author=request.user) | Q(members=request.user))

        workspace_serialized = WorkspaceSerializer(workspaces, many=True)
        return Response({'status': 'success', 'workspace_data': workspace_serialized.data}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'status': f'error {e}'})