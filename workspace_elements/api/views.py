from rest_framework.decorators import api_view
from rest_framework.response import Response
from boards.models import Board
from boards.api.serializers import BoardSerializer

@api_view(['POST', 'GET'])
def create_element(request):
    element_type = request.data['element_type']
    element_title = request.data['element_title']
    user = request.user
    if element_type == 'board':
        board = Board.objects.create(user=user, title=element_title)
        board.save()
        print(board, board.title, board.user)
    return Response({'status': 'success'})


@api_view(['POST', 'GET'])
def get_elements(request):
    boards = Board.objects.filter(user=request.user)
    boards_serialized = BoardSerializer(boards, many=True)
    return Response({'status': 'success', 'boards': boards_serialized.data})