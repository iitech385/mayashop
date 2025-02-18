from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('update-profile/', views.update_profile, name='update-profile'),
    path('signup/', views.signup_view, name='signup'),
    path('search-users/', views.search_users, name='search-users'),
    path('user/<int:user_id>/', views.user_profile, name='user-profile'),
    path('wishlist/', views.manage_wishlist, name='manage-wishlist'),
    path('user/<int:user_id>/wishlist', views.get_user_wishlist, name='user-wishlist'),
] 