from django.urls import path
from . import views

urlpatterns = [
    path('auth/google/', views.GoogleSignInView.as_view(), name='google_signin'),
    path('signup/', views.signup),
    path('login/', views.login),
    path('change-standard-email/', views.change_standard_email)
]