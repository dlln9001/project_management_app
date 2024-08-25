from rest_framework.response import Response
from rest_framework.decorators import api_view
from ..models import Board
from .serializers import BoardFullSerializer

@api_view(['GET', 'POST'])
def get_board(request):
    board_id = request.data['id']
    board = Board.objects.get(id=board_id)
    serialized = BoardFullSerializer(board)
    return Response({'Status': 'success', 'boardInfo': serialized.data})