from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.contenttypes.models import ContentType
from boards.models import Board
from boards.api.serializers import BoardSummarySerializer
from boards.models import BoardView
from document.models import Document
from document.api.serializers import DocumentSerializer
from ..models import WorkspaceElement
from ..models import RecentlyVisited

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
        board_content_type = ContentType.objects.get_for_model(Board)
        workspace_element_board = WorkspaceElement.objects.create(content_type=board_content_type, object_id=board.id)
    if element_type == 'doc':
        document = Document.objects.create(author=user, title=element_name, content='', order=num_of_docs)
        document_content_type = ContentType.objects.get_for_model(Document)
        workspace_element_document = WorkspaceElement.objects.create(content_type=document_content_type, object_id=document.id)
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


@api_view(['POST', 'GET'])
def get_recently_visited_elements(request):
    all_recently_visited = RecentlyVisited.objects.filter(user=request.user)
    data = []
    for recently_visited in all_recently_visited:
        workspace_element = recently_visited.workspace_element
        if isinstance(workspace_element.content_object, Board):
            board_object = workspace_element.content_object
            data.append({'element_type': 'board', 'element_name': board_object.name, 'last_visited': recently_visited.visited_at})
        elif isinstance(workspace_element.content_object, Document):
            document_object = workspace_element.content_object
            data.append({'element_type': 'document', 'element_name': document_object.title, 'last_visited': recently_visited.visited_at})
    return Response({'status': 'success', 'recently_visited_data': data}, status=status.HTTP_200_OK)