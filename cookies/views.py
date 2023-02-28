from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework import authentication, permissions, generics
from rest_framework.decorators import api_view
from django.contrib.auth.models import User 
from .models import *
from .serializers import *

# Create your views here.

class CookieViewSet(generics.ListCreateAPIView):
    queryset = Cookie.objects.all()
    serializer_class = CookieSerializers
