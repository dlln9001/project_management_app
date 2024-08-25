from rest_framework.response import Response
from rest_framework.decorators import api_view
from ..models import Board
from .serializers import BoardFullSerializer
from ..models import Group
from .serializers import GroupSerializer

@api_view(['GET', 'POST'])
def get_board(request):
    board_id = request.data['board_id']
    board = Board.objects.get(id=board_id)
    serialized = BoardFullSerializer(board)
    return Response({'status': 'success', 'boardInfo': serialized.data})


@api_view(['GET', 'POST'])
def create_group(request):
    board_id = request.data['board_id']
    board = Board.objects.get(id=board_id)
    group = Group.objects.create(board=board)
    group.save()
    return Response({'status': 'success'})

@api_view(['GET', 'POST'])
def get_groups(request):
    board_id = request.data['board_id']
    board = Board.objects.get(id=board_id)
    groups = Group.objects.filter(board=board)
    serialized = GroupSerializer(groups, many=True)
    return Response({'status': 'success', 'groupsInfo': serialized.data})
