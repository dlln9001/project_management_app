from django.db import models
from user_authentication.models import User
# Create your models here.

class Workspace(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workspaces_created')
    members = models.ManyToManyField(User, related_name='workspaces_joined')
    name = models.CharField(max_length=255, default='New Workspace')
    is_main = models.BooleanField()
    color = models.CharField(max_length=255, default='bg-sky-400')
