from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.shortcuts import get_object_or_404
from user_authentication.models import User
from user_authentication.api.serializers import UserSerializer
from workspace.models import Workspace, WorkspaceInvite
from workspace.api.serializers import WorkspaceInviteSerializer
from notifications.models import Notifications

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
        workspace = Workspace.objects.get(id=request.data['workspace_id'])
        if not user_invited:
            return Response({'status': 'The invitation has been processed successfully'})
        elif user_invited and user_invited[0] == request.user:
            return Response({'status': 'Cannot invite yourself'})
        elif workspace.author == user_invited[0]:
            return Response({'status': 'error'})
        else:
            workspace_invite_check = WorkspaceInvite.objects.filter(sender=request.user, receiver=user_invited[0], status='pending', workspace=workspace)
            if workspace_invite_check:
                return Response({'status': 'invite already sent'})
            workspace_invite = WorkspaceInvite.objects.create(sender=request.user, receiver=user_invited[0], status='pending', workspace=workspace)

            # do web socket 
            notification = Notifications.objects.create(user=user_invited[0], message=f'{request.user.email} invited you!', type='invite')
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send) (
                f'notifications_user_{user_invited[0].id}',
                {
                    'type': 'send_notification',
                    'message': {
                        'type': 'notification',
                        'user': UserSerializer(request.user),
                        'notification_type': 'invite',
                        'message': f'{request.user.email} invited you!',
                        'notification_id': notification.id
                    }
                }
            )

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


@api_view(['POST'])
def accept_invite(request):
    try:
        invite = WorkspaceInvite.objects.get(id=request.data['invite_id'])
        if invite.receiver == request.user:
            workspace = invite.workspace
            workspace.members.add(request.user)
            invite.status = 'accepted'
            invite.save()
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'error'})
    except Exception as e:
        print(e)
        return Response({'status': 'error'})


@api_view(['POST'])
def remove_member_from_workspace(request):
    try:
        workspace = Workspace.objects.get(id=request.data['workspace_id'])
        if workspace.author == request.user:
            user_to_be_removed = User.objects.get(id=request.data['member_id'])
            workspace.members.remove(user_to_be_removed)
            return Response({'status': 'success'})
        return Response({'status': 'error'})
    except Exception as e:
        print(e)
        return Response({'status': 'error'})