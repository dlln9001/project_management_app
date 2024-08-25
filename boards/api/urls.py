from django.urls import path
from . import views

urlpatterns = [
    path('get/', views.get_board),
    path('create-group/', views.create_group),
    path('get-groups/', views.get_groups),
]