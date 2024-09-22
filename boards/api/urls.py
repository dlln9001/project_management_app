from django.urls import path
from . import views

urlpatterns = [
    path('get/', views.get_board, name='get-board'),
    path('change-board-name/', views.change_board_name, name='change-board-name'),
    path('change-board-description/', views.change_board_description, name='change-board-description'),
    path('delete-board/', views.delete_board, name='delete-board'),
    path('create-group/', views.create_group, name='create-group'),
    path('get-groups/', views.get_groups, name='get-groups'),
    path('create-item/', views.create_item, name='create-item'),
    path('edit-item/', views.edit_item, name='edit-item'),
    path('delete-item/', views.delete_item, name='delete-item'),
    path('edit-group-name/', views.edit_group_name, name='edit-group-name'),
    path('delete-group/', views.delete_group, name='delete-group'),
    path('edit-group-color/', views.edit_group_color, name='edit-group-color'),
    path('create-column/', views.create_column, name='create-column'),
    path('edit-column-value/', views.edit_column_value, name='edit-column-value'),
    path('delete-column/', views.delete_column, name='delete-column'), 
    path('edit-column-name/', views.edit_column_name, name='edit-column-name')
]