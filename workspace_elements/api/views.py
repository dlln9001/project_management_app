from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.contenttypes.models import ContentType
from boards.models import Board
from boards.api.serializers import BoardSummarySerializer
from boards.models import BoardView
from document.models import Document
from document.api.serializers import DocumentSerializer
from workspace.models import Workspace
from django.db.models import Count
from ..models import WorkspaceElement
from ..models import RecentlyVisited
from ..models import Favorite


@api_view(['POST', 'GET'])
def create_element(request):
    element_type = request.data['element_type']
    element_name = request.data['element_name']

    user = request.user
    
    all_boards = Board.objects.filter(user=user)
    all_docs = Document.objects.filter(author=user)
    workspace = Workspace.objects.get(id=request.data['workspace_id'])
    
    num_of_boards = len(all_boards)
    num_of_docs = len(all_docs)

    if element_type == 'board':
        board = Board.objects.create(user=user, name=element_name, order=num_of_boards)
        board_view = BoardView.objects.create(board=board, name='Main Table', type='Table', order=0)
        board_content_type = ContentType.objects.get_for_model(Board)
        workspace_element_board = WorkspaceElement.objects.create(content_type=board_content_type, object_id=board.id, workspace=workspace)

    if element_type == 'doc':
        document = Document.objects.create(author=user, title=element_name, content='', order=num_of_docs)
        document_content_type = ContentType.objects.get_for_model(Document)
        workspace_element_document = WorkspaceElement.objects.create(content_type=document_content_type, object_id=document.id, workspace=workspace)
    return Response({'status': 'success'})


@api_view(['POST', 'GET'])
def get_elements(request):
    workspace = Workspace.objects.get(id=request.data['selected_workspace_id'])

    board_content_type = ContentType.objects.get_for_model(Board)

    workspace_elements = WorkspaceElement.objects.filter(content_type=board_content_type, workspace=workspace)
    boards = [element.content_object for element in workspace_elements]

    # reorder all the boards
    index = 0
    for board in boards:
        board.order = index
        board.save()
        index += 1
    workspace_elements = WorkspaceElement.objects.filter(content_type=board_content_type, workspace=workspace)
    boards = [element.content_object for element in workspace_elements]
    boards_serialized = BoardSummarySerializer(boards, many=True)


    document_content_type = ContentType.objects.get_for_model(Document)
    workspace_elements = WorkspaceElement.objects.filter(content_type=document_content_type, workspace=workspace)
    documents = [element.content_object for element in workspace_elements]

    # reorder all the documents
    index = 0
    for document in documents:
        document.order = index
        document.save()
        index += 1
    workspace_elements = WorkspaceElement.objects.filter(content_type=document_content_type, workspace=workspace)
    documents = [element.content_object for element in workspace_elements]
    documents_serialized = DocumentSerializer(documents, many=True)
    return Response({'status': 'success', 'boards': boards_serialized.data, 'documents': documents_serialized.data})


@api_view(['POST', 'GET'])
def get_recently_visited_elements(request):
    all_recently_visited = RecentlyVisited.objects.filter(user=request.user)
    data = []

    index = 0
    for recently_visited in all_recently_visited:
        workspace_element = recently_visited.workspace_element

        if index > 4:
            break

        if isinstance(workspace_element.content_object, Board):
            board_object = workspace_element.content_object
            data.append({'element_type': board_object.type, 'element_name': board_object.name, 'id': board_object.id, 'last_visited': recently_visited.visited_at})

        elif isinstance(workspace_element.content_object, Document):
            document_object = workspace_element.content_object
            data.append({'element_type': document_object.type, 'element_name': document_object.title, 'id': document_object.id, 'last_visited': recently_visited.visited_at})
        index += 1

    return Response({'status': 'success', 'recently_visited_data': data}, status=status.HTTP_200_OK)


@api_view(['POST', 'GET'])
def add_to_favorites(request):
    try:
        element_type = request.data['element_type']

        if element_type == 'board':
            board_content_type = ContentType.objects.get_for_model(Board)
            workspace_element_board = WorkspaceElement.objects.get(content_type=board_content_type, object_id=request.data['id'])
            check_favorite = Favorite.objects.filter(user=request.user, workspace_element=workspace_element_board)
            # make sure it's not favorited already
            if len(check_favorite) == 0:
                Favorite.objects.create(user=request.user, workspace_element=workspace_element_board)
            else:
                return Response({'status': 'already favorited'})

        elif element_type == 'document':
            document_content_type = ContentType.objects.get_for_model(Document)
            workspace_element_document = WorkspaceElement.objects.get(content_type=document_content_type, object_id=request.data['id'])
            check_favorite = Favorite.objects.filter(user=request.user, workspace_element=workspace_element_document)
            if len(check_favorite) == 0:
                Favorite.objects.create(user=request.user, workspace_element=workspace_element_document)
            else:
                return Response({'status': 'already favorited'})
        return Response({'status': 'success'}, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)
        return Response({'status': f'error {e}'})
        

@api_view(['POST', 'GET'])
def get_favorites(request):
    try:
        favorited_elements = []
        favorites = Favorite.objects.filter(user=request.user)

        for favorite in favorites:
            workspace_element = favorite.workspace_element
            content_object = workspace_element.content_object
            if content_object.type == 'board':
                favorited_elements.append({'element_type': content_object.type, 'element_name': content_object.name, 'id': content_object.id, 'favorite_model_id': favorite.id})
            elif content_object.type == 'document':
                favorited_elements.append({'element_type': content_object.type, 'element_name': content_object.title, 'id': content_object.id, 'favorite_model_id': favorite.id})
        return Response({'status': 'success', 'favorites': favorited_elements}, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)
        return Response({'status': f'error {e}'})
    

@api_view(['POST', 'GET'])
def remove_favorite(request):
    try:
        favorite = Favorite.objects.get(id=request.data['favorite_id'])
        favorite.delete()
        return Response({'status': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'status': f'error {e}'})