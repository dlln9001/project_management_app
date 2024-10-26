from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.contenttypes.models import ContentType
from ..models import Document
from .serializers import DocumentSerializer
from ..models import DocumentImage
from workspace_elements.models import WorkspaceElement
from workspace_elements.models import RecentlyVisited

@api_view(['GET', 'POST'])
def getDocument(request):
    document = Document.objects.get(id=request.data['document_id'])
    document_serialized = DocumentSerializer(document)

    # set recently visited
    document_content_type = ContentType.objects.get_for_model(Document)
    workspace_element = WorkspaceElement.objects.get(content_type=document_content_type, object_id=document.id)
    RecentlyVisited.update_recently_visited(user=request.user, workspace_element=workspace_element)
    return Response({'status': 'success', 'documentInfo': document_serialized.data}, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def saveDocument(request):
    document = Document.objects.get(id=request.data['document_id'])
    document.content = request.data['document_content']
    document.save()
    return Response({'status': 'success'}, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def delete_document(request):
    document = Document.objects.get(id=request.data['document_id'])
    document.delete()
    return Response({'status': 'success'}, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def change_title(request):
    document = Document.objects.get(id=request.data['document_id'])
    document.title = request.data['title']
    document.save()
    return Response({'status': 'success'}, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def add_image(request):
    image_file = request.FILES.get('new_image')
    document_id = request.POST.get('document_id')
    document = Document.objects.get(id=document_id)
    image = DocumentImage.objects.create(document=document, image=image_file)
    image_url = image.image.url
    return Response({'status': 'success', 'image_url': image_url}, status=status.HTTP_200_OK)