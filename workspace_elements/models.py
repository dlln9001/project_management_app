from django.db import models
from user_authentication.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from document.models import Document
from boards.models import Board
from workspace.models import Workspace
# Create your models here.

class WorkspaceElement(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE)

@receiver(post_delete, sender=Board)
@receiver(post_delete, sender=Document)
def delete_workspace_element_on_target_delete(sender, instance, **kwargs):
    # Delete related WorkspaceElement instances
    content_type = ContentType.objects.get_for_model(sender)
    WorkspaceElement.objects.filter(
        content_type=content_type,
        object_id=instance.id
    ).delete()


class RecentlyVisited(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    workspace_element = models.ForeignKey(WorkspaceElement, on_delete=models.CASCADE)
    visited_at = models.DateTimeField(auto_now=True)  # Updates on every save

    def update_recently_visited(user, workspace_element):
    # Create or update existing entry
        recent, created = RecentlyVisited.objects.get_or_create(
            user=user,
            workspace_element=workspace_element,
        )
        
        if not created:
            # Update timestamp
            recent.save()

    class Meta:
        ordering = ['-visited_at']  # Most recent first

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    workspace_element = models.ForeignKey(WorkspaceElement, on_delete=models.CASCADE)
    