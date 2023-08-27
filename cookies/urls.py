from django.urls import path, include 
from . import views
from rest_framework import routers 

urlpatterns = [
    path('', views.CookieViewSet.as_view(), name="cookies"),
    path('friend/<str:usernameURL>', views.AddFriend, name="friend"),
    path('friendSearch', views.FriendSearch.as_view(), name="friendSearch"),
    path('<int:id>', views.CookieDetails.as_view(), name="cookie"),
    path('search', views.CookieSearch.as_view(), name="cookieSearch"),
    path('auth/', views.Auth, name="auth"),
    path('user/<str:name>', views.User.as_view(), name="user"),
    path('favorite', views.Favorite, name="favorite"),
    path('friendStats', views.FriendStats, name="friendStats"),
    path('get_average_rating', views.GetAverageRating, name="getAverageRating"),
    path('get_user_rating', views.GetUserRating, name="getUserRating"),
    path('remove', views.Remove, name="remove"),
    path('leaderboard', views.Leaderboard.as_view(), name="leaderboard"),
    path('logout/', views.Logout, name="logout"),
    path('rate', views.Rate, name="rate"),
    path('register/', views.Register, name="register"),
    path('remove/<str:usernameURL>', views.RemoveFriend, name="remove"),
    path('suggestions/', views.Suggestions, name="suggestions"),
    path('who/', views.Who, name="who"),
    path('csrf/', views.csrf, name="csrf")
]