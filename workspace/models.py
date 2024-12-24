from django.db import models
from user_authentication.models import User
# Create your models here.

class Workspace(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workspaces_created')
    members = models.ManyToManyField(User, related_name='workspaces_joined')
    name = models.CharField(max_length=255, default='New Workspace')
    is_main = models.BooleanField(default=False)
    color = models.CharField(max_length=255, default='bg-sky-400')
    cover_color = models.CharField(max_length=255, default='bg-slate-100')
    description = models.TextField(blank=True, default='')


class WorkspaceInvite(models.Model):
    status_choices = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined')
    ]

    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_invites')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_invites')
    status = models.CharField(max_length=30, choices=status_choices, default='pending')
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']  # Most recent invites first
