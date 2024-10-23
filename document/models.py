from django.db import models
from user_authentication.models import User
from django.db.models.signals import post_delete
from django.dispatch import receiver
import os


# Create your models here.
class Document(models.Model):
    title = models.CharField(max_length=255, default='New Doc')
    content = models.TextField(default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')


class DocumentImage(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='images/document/')


@receiver(post_delete, sender=DocumentImage)
def delete_image_file(sender, instance, **kwargs):
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)