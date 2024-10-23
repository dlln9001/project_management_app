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
    all_boards = Board.objects.filter(user=user)
    all_docs = Document.objects.filter(author=user)
    num_of_boards = len(all_boards)
    num_of_docs = len(all_docs)
    if element_type == 'board':
        board = Board.objects.create(user=user, name=element_name, order=num_of_boards)
        board_view = BoardView.objects.create(board=board, name='Main Table', type='Table', order=0)
        board.save()
        board_view.save()
    if element_type == 'doc':
        document = Document.objects.create(author=user, title=element_name, content='', order=num_of_docs)
        document.save()
    return Response({'status': 'success'})


@api_view(['POST', 'GET'])
def get_elements(request):
    boards = Board.objects.filter(user=request.user).order_by('order')
    # reorder all the boards
    index = 0
    for board in boards:
        board.order = index
        board.save()
        index += 1
    boards = Board.objects.filter(user=request.user).order_by('order')
    boards_serialized = BoardSummarySerializer(boards, many=True)

    # if shared documents are added, this would need to change (the author part)
    documents = Document.objects.filter(author=request.user).order_by('order')
    # reorder all the documents
    index = 0
    for document in documents:
        document.order = index
        document.save()
        index += 1
    documents = Document.objects.filter(author=request.user).order_by('order')
    documents_serialized = DocumentSerializer(documents, many=True)
    return Response({'status': 'success', 'boards': boards_serialized.data, 'documents': documents_serialized.data})