from django.urls import path
from . import views

urlpatterns = [
    path('auth/google/', views.GoogleSignInView.as_view(), name='google_signin'),
]