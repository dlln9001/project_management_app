from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_element),
    path('get/', views.get_elements),
    path('get-recently-visited-elements/', views.get_recently_visited_elements),
    path('add-to-favorites/', views.add_to_favorites),
    path('get-favorites/', views.get_favorites),
    path('remove-favorite/', views.remove_favorite)
]