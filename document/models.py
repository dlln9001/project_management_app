from django.db import models
from user_authentication.models import User

# Create your models here.
class Document(models.Model):
    title = models.CharField(max_length=255, default='New Doc')
    content = models.TextField(default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
