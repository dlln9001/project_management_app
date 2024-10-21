from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Document
from .serializers import DocumentSerializer

@api_view(['GET', 'POST'])
def getDocument(request):
    document = Document.objects.get(id=request.data['document_id'])
    document_serialized = DocumentSerializer(document)
    return Response({'status': 'success', 'documentInfo': document_serialized.data}, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def saveDocument(request):
    document = Document.objects.get(id=request.data['document_id'])
    document.content = request.data['document_content']
    document.save()
    return Response({'status': 'success'}, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def change_title(request):
    document = Document.objects.get(id=request.data['document_id'])
    document.title = request.data['title']
    document.save()
    return Response({'status': 'success'}, status=status.HTTP_200_OK)