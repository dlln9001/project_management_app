from django.urls import path
from . import views

urlpatterns = [
    path('get-document/', views.getDocument),
    path('save-document/', views.saveDocument),
    path('change-title/', views.change_title),
    path('delete-document/', views.delete_document),
    path('add-image/', views.add_image)
]