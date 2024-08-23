from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_element),
    path('get/', views.get_elements),
]