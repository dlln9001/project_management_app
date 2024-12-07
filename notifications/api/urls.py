from django.urls import path
from . import views

urlpatterns = [
    path('get-unread-notifications/', views.get_unread_notifications),
    path('get-all-notifications/', views.get_all_notifications)
]