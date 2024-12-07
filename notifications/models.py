from django.db import models
from user_authentication.models import User

# Create your models here.
class Notifications(models.Model):
    notification_types = [
        ('invite', 'Invite'),
        ('member left workspace', 'Member left workspace')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    type = models.CharField(max_length=50, choices=notification_types)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']  # Most recent notifications first