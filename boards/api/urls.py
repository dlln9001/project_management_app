from django.urls import path
from . import views

urlpatterns = [
    path('get/', views.get_board),
    path('create-group/', views.create_group),
    path('get-groups/', views.get_groups),
    path('create-item/', views.create_item),
    path('edit-item/', views.edit_item),
    path('delete-item/', views.delete_item),
    path('edit-group-name/', views.edit_group_name)
]