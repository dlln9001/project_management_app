from django.db import models
from django.contrib.auth.models import AbstractUser
import os

class User(AbstractUser):
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=250, unique=True, null=False, blank=False)
    google_id = models.CharField(max_length=100, blank=True, null=True)
    profile_picture = models.ImageField(null=True, blank=True, upload_to='images/profile-pictures/')
    is_default_profile_picture = models.BooleanField(default=True)

    REGISTRATION_CHOICES = [
        ('email', 'Email'),
        ('google', 'Google'),
    ]
    registration_method = models.CharField(
        max_length=10,
        choices=REGISTRATION_CHOICES,
        default='email'
    )

    def __str__(self):
       return self.username

    def update_profile_picture(self, new_picture):
        if self.profile_picture:
            if os.path.isfile(self.profile_picture.path):
                os.remove(self.profile_picture.path)
        
        self.profile_picture = new_picture
        self.is_default_profile_picture = False
        self.save()

    def delete_profile_picture(self):
        if self.profile_picture:
            if os.path.isfile(self.profile_picture.path):
                os.remove(self.profile_picture.path)
                
        self.is_default_profile_picture = True
        self.save()