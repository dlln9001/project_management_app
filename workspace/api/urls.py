from django.urls import path
from . import views

urlpatterns = [
    path('get-workspaces/', views.get_workspace),
    path('create-workspace/', views.create_workspace)
] 