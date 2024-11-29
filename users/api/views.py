from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.shortcuts import get_object_or_404
from user_authentication.models import User
from user_authentication.api.serializers import UserSerializer
from workspace.models import Workspace, WorkspaceInvite
from workspace.api.serializers import WorkspaceInviteSerializer

@api_view(['POST', 'GET'])
def get_user_info(request):
    try:
        user = get_object_or_404(User, id=request.data['user_id'])
    except:
        return Response({'status': 'user not found'})
    user_serialized = UserSerializer(instance=user)
    return Response({'status': 'success', 'user_info': user_serialized.data})


@api_view(['POST', 'GET'])
def change_pfp(request):
    pfp_file = request.FILES.get('pfp_file')
    user = request.user
    user.update_profile_picture(pfp_file)
    user_serialized = UserSerializer(user)
    return Response({'status': 'success', 'user': user_serialized.data}, status=status.HTTP_200_OK)


@api_view(['DELETE'])
def delete_pfp(request):
    user = request.user
    user.delete_profile_picture()
    user_serialized = UserSerializer(user)
    return Response({'status': 'success', 'user': user_serialized.data}, status=status.HTTP_200_OK)


@api_view(['POST', 'GET'])
def change_name(request):
    user = request.user
    user.name = request.data['new_name']
    user.save()
    user_serialized = UserSerializer(user)
    return Response({'status': 'success', 'user': user_serialized.data}, status=status.HTTP_200_OK)


@api_view(['POST'])
def invite_user_to_workspace(request):
    try:
        user_invited = User.objects.filter(email=request.data['email'])
        if not user_invited:
            return Response({'status': 'The invitation has been processed successfully'})
        elif user_invited and user_invited[0] == request.user:
            return Response({'status': 'Cannot invite yourself'})
        else:
            workspace = Workspace.objects.get(id=request.data['workspace_id'])
            workspace_invite_check = WorkspaceInvite.objects.filter(sender=request.user, receiver=user_invited[0], status='pending', workspace=workspace)
            if workspace_invite_check:
                return Response({'status': 'invite already sent'})
            workspace_invite = WorkspaceInvite.objects.create(sender=request.user, receiver=user_invited[0], status='pending', workspace=workspace)
            return Response({'status': 'The invitation has been processed successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'status': 'error'})
    

@api_view(['GET'])
def get_invites(request):
    try:
        invites_sent = WorkspaceInvite.objects.filter(sender=request.user)
        invites_received = WorkspaceInvite.objects.filter(receiver=request.user)
        invites_sent_serialized = WorkspaceInviteSerializer(invites_sent, many=True)
        invites_received_serialized = WorkspaceInviteSerializer(invites_received, many=True)
        return Response({'status': 'success', 'invites_sent': invites_sent_serialized.data, 'invites_received': invites_received_serialized.data})
    except Exception as e:
        print(e)
        return Response({'status': 'error'})