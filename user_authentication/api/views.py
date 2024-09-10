import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from ..models import User
from .serializers import UserSerializer

class GoogleSignInView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    def post(self, request):    
        token = request.data.get('token')
        try:
            user_info_response = requests.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                headers={'Authorization': f'Bearer {token}'}
            )
            user_info = user_info_response.json()
            if user_info_response.status_code != 200:
                return Response(
                    {'status': 'unsuccessful', 'error': 'Failed to get user info from Google'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            email = user_info['email']
            google_id = user_info['sub']
            name = user_info.get('name', '')

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email,
                    'name': name,
                    'google_id': google_id,
                    'registration_method': 'google'
                }
            )
            if created:
                user.set_unusable_password()
                user.save()

            serializer = UserSerializer(user)
            # deletes old token if it already exists
            Token.objects.filter(user=user).delete()
            token = Token.objects.create(user=user)
            return Response({'status': 'success', 'user': serializer.data, 'token': token.key})

        except Exception as e:
            return Response(
                {'status': 'unsuccessful', 'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        token = Token.objects.create(user=user)
        return Response({'status': 'success', 'user': serializer.data, 'token': token.key})
    return Response({'username_taken': 'A user with that email already exists'})


@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def login(request):
    try:
        user = get_object_or_404(User, username=request.data['username'])
    except:
        return Response({'incorrect_email_or_password': 'true'})
    if not user.check_password(request.data['password']):
        return Response({'incorrect_email_or_password': 'true'}, status=status.HTTP_400_BAD_REQUEST)
    Token.objects.filter(user=user).delete()
    token = Token.objects.create(user=user)
    serializer = UserSerializer(instance=user)
    return Response({'status': 'success', 'user': serializer.data, 'token': token.key})


@api_view(['POST', 'GET'])
def get_user_info(request):
    try:
        user = get_object_or_404(User, id=request.data['user_id'])
    except:
        return Response({'status': 'user not found'})
    user_serialized = UserSerializer(instance=user)
    return Response({'status': 'success', 'user_info': user_serialized.data})