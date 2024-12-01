from django.urls import path
from . import views

urlpatterns = [
    path('get-user-info/', views.get_user_info),
    path('change-pfp/', views.change_pfp),
    path('delete-pfp/', views.delete_pfp),
    path('change-name/', views.change_name),
    path('invite-user-to-workspace/', views.invite_user_to_workspace),
    path('get-invites/', views.get_invites),
    path('accept-invite/', views.accept_invite),
    path('remove-member-from-workspace/', views.remove_member_from_workspace)
]