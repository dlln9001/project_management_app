from django.db import models
from user_authentication.models import User

# Create your models here.
class Board(models.Model):
    name = models.CharField(max_length=255, default='New Board')
    user = models.ForeignKey(User, on_delete=models.CASCADE) # this user is the author
    description = models.CharField(max_length=2550, default="Add your board's description here")
    type = models.CharField(max_length=50, default='board', editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    order = models.IntegerField()

    class Meta:
        ordering = ['order']  

class BoardView(models.Model):
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=200)
    order = models.IntegerField()

class Group(models.Model):
    name = models.CharField(max_length=255, default='New Group')
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    order = models.IntegerField()
    color = models.CharField(max_length=255, default='bg-sky-400')

class Item(models.Model):
    name = models.CharField(max_length=2550, default='New item')
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    order = models.IntegerField()

class ItemUpdate(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.CharField(max_length=2000, default='')
    created_at = models.DateTimeField(auto_now_add=True)

class Column(models.Model):
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    # name is for user's reference (if the user wants to name it something else), while column type is for application's reference
    name = models.CharField(max_length=200)
    column_type = models.CharField(max_length=200)
    order = models.IntegerField()

class ColumnValue(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    column = models.ForeignKey(Column, on_delete=models.CASCADE)

    value_text = models.CharField(max_length=255, null=True, blank=True, default='') # for text, like status, or priority
    value_color = models.CharField(max_length=255, null=True, blank=True, default='bg-neutral-400')
    value_date = models.DateTimeField(null=True, blank=True) # for date values
    value_person = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True) # for person columns
    value_number = models.DecimalField(max_digits=20, decimal_places=8, null=True, blank=True)

    class Meta:
        ordering = ['column__order']

