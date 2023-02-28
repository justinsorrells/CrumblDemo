from django.urls import path, include 
from . import views
from rest_framework import routers 

urlpatterns = [
    path('api/', views.CookieViewSet.as_view(), name="cookies"),
]