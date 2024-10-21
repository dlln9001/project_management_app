from rest_framework.decorators import api_view
from rest_framework.response import Response
from boards.models import Board
from boards.api.serializers import BoardSummarySerializer
from boards.models import BoardView
from document.models import Document
from document.api.serializers import DocumentSerializer

@api_view(['POST', 'GET'])
def create_element(request):
    element_type = request.data['element_type']
    element_name = request.data['element_name']
    user = request.user
    if element_type == 'board':
        board = Board.objects.create(user=user, name=element_name)
        board_view = BoardView.objects.create(board=board, name='Main Table', type='Table', order=0)
        board.save()
        board_view.save()
    if element_type == 'doc':
        document = Document.objects.create(author=user, title=element_name, content='')
        document.save()
    return Response({'status': 'success'})


@api_view(['POST', 'GET'])
def get_elements(request):
    boards = Board.objects.filter(user=request.user)
    boards_serialized = BoardSummarySerializer(boards, many=True)

    # if shared documents are added, this would need to change
    documents = Document.objects.filter(author=request.user)
    documents_serialized = DocumentSerializer(documents, many=True)
    return Response({'status': 'success', 'boards': boards_serialized.data, 'documents': documents_serialized.data})