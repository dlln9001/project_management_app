from django.urls import path
from . import views

urlpatterns = [
    path('get-user-info/', views.get_user_info),
    path('change-pfp/', views.change_pfp),
    path('delete-pfp/', views.delete_pfp)
]