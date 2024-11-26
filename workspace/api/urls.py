from django.urls import path
from . import views

urlpatterns = [
    path('get-workspaces/', views.get_workspace),
    path('create-workspace/', views.create_workspace),
    path('delete-workspace/<int:id>/', views.delete_workspace),
    path('change-workspace-name/', views.change_workspace_name),
    path('get-extra-information/<int:id>/', views.get_extra_information),
    path('change-description/', views.change_description),
    path('change-color/', views.change_color)
] 