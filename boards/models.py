from django.db import models
from user_authentication.models import User

# Create your models here.
class Board(models.Model):
    title = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=50, default='board', editable=False)