# Generated by Django 4.2.15 on 2024-11-19 21:02

from django.db import migrations
from django.contrib.contenttypes.models import ContentType
from boards.models import Board as imported_board
from document.models import Document as imported_document


def create_workspaces_for_existing_users(apps, schema_editor):
    User = apps.get_model('user_authentication', 'User')  # Adjust if you're using a custom User model
    Workspace = apps.get_model('workspace', 'Workspace')
    WorkspaceElement = apps.get_model('workspace_elements', 'WorkspaceElement')
    Board = apps.get_model('boards', 'Board')
    Document = apps.get_model('document', 'Document')
    ContentType = apps.get_model('contenttypes', 'ContentType')


    for user in User.objects.all():
        workspace = Workspace.objects.create(
            author=user
        )
        workspace.members.add(user)

        boards = Board.objects.filter(user=user)
        documents = Document.objects.filter(author=user)
        
        board_content_type = ContentType.objects.get_for_model(Board)
        document_content_type = ContentType.objects.get_for_model(Document)

        for board in boards:
            workspace_element = WorkspaceElement.objects.get(content_type=board_content_type, object_id=board.id)
            workspace_element.workspace = workspace
            workspace_element.save()
        for document in documents:
            workspace_element = WorkspaceElement.objects.get(content_type=document_content_type, object_id=document.id)
            workspace_element.workspace = workspace
            workspace_element.save()


class Migration(migrations.Migration):
    dependencies = [
        ('workspace', '0001_initial'),
        ('user_authentication', '0004_user_is_default_profile_picture_user_profile_picture'),  # Add dependency for User model
        ('boards', '0002_itemupdate'),              # Add dependency for Board model
        ('document', '0002_document_type'),            # Add dependency for Document model
        ('workspace_elements', '0003_workspaceelement_workspace'),   # Add dependency for WorkspaceElement model

    ]

    operations = [
        migrations.RunPython(create_workspaces_for_existing_users),
    ]