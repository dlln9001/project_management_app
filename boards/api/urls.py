from django.urls import path
from . import views

urlpatterns = [
    path('get/', views.get_board),
    path('create-group/', views.create_group),
    path('get-groups/', views.get_groups),
    path('create-item/', views.create_item),
    path('edit-item/', views.edit_item),
    path('delete-item/', views.delete_item),
    path('edit-group-name/', views.edit_group_name),
    path('delete-group/', views.delete_group),
    path('edit-group-color/', views.edit_group_color),
    path('create-column/', views.create_column),
    path('edit-column-value/', views.edit_column_value),
    path('delete-column/', views.delete_column), 
]