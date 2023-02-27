from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework import authentication, permissions
from django.contrib.auth.models import User 

# Create your views here.

def index(request):
    return render(request, 'cookies/index.html')