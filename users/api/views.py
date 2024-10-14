from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.shortcuts import get_object_or_404
from user_authentication.models import User
from user_authentication.api.serializers import UserSerializer


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