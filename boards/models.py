from django.db import models
from user_authentication.models import User

# Create your models here.
class Board(models.Model):
    name = models.CharField(max_length=255, default='New Board')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=50, default='board', editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Group(models.Model):
    name = models.CharField(max_length=255, default='New Group')
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    order = models.IntegerField()
    color = models.CharField(max_length=255, default='bg-sky-400')

class Item(models.Model):
    name = models.CharField(max_length=2550, default='New item')
    group = models.ForeignKey(Group, models.CASCADE)
    order = models.IntegerField()