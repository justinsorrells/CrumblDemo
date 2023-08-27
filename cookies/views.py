from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import authentication, permissions, generics
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.decorators import api_view
from django.views.generic.detail import DetailView
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.models import User 
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.db.models import Count, Avg
from .models import Cookie as Cookie
from .models import User as UserObj
from .models import Rating as Rating
from .serializers import *
from .utils.helpers import check_duplicate_user, check_duplicate_favorite
from django.middleware.csrf import get_token
import json

# Create your views here.

def AddFriend(request, usernameURL):
    response = HttpResponse(status=200)
    response.headers["cors"] = 'true'
    response.headers["Access-Control-Allow-Credentials"] = 'true'

    try:
        user = UserObj.objects.get(username=request.user)
        profile = UserObj.objects.get(username=usernameURL)
        if user != profile:
            user.following.add(profile)
        else:
            response.status = 400
    except:
        response.status = 400
    return response

def Auth(request):
    temp = json.loads(request.body)
    username = temp["username"]
    password = temp["password"]
    errors = {}
    if (len(username) < 1):
        errors["validationUsername"] = "Must enter a username"
    if (len(password) < 1):
        errors["validationPassword"] = "Must enter a password"
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
    else:
        if "validationUsername" not in errors and "validationPassword" not in errors:
            errors["validationUsername"] = "User does not exits or password is incorrect"
    return HttpResponse(json.dumps(errors), content_type="application/json")

class CookieDetails(APIView):
    def get(self, request, formate=None, **kwargs):
        queryset = Cookie.objects.get(id=self.kwargs['id'])
        serializer_class = CookieSerializers(queryset)
        return Response(serializer_class.data)

class CookieSearch(APIView):
    def post(self, request, formate=None, **kwargs):
        temp = json.loads(request.body)
        cookieName = temp['name']
        queryset = Cookie.objects.filter(name__startswith=cookieName)
        serializer_class = CookieSerializers(queryset, many=True)
        return Response(serializer_class.data)

class CookieViewSet(generics.ListCreateAPIView):
    queryset = Cookie.objects.all().order_by('name')
    serializer_class = CookieSerializers

def csrf(request):
    response = HttpResponse(get_token(request), content_type="text/plain")
    response.headers["SameSite"] = 'Lax'
    return response

def Favorite(request):
    response = HttpResponse()
    response.headers["cors"] = 'true'
    response.headers["Access-Control-Allow-Credentials"] = 'true'
    
    if request.method == "POST":
        body = json.loads(request.body)
        cookie_id = body['id']
        if cookie_id is None:
            response.status = 400
            return response
        try:
            user = UserObj.objects.get(username=request.user)
        except:
            response.status = 400
            return response
        if user is not None:
            duplicate_cookie = check_duplicate_favorite(int(user.id), cookie_id)
            if duplicate_cookie is False:
                try:
                    cookie = Cookie.objects.get(id=cookie_id)
                    user.user_upvotes.add(cookie)
                    user.save()
                    response.status = 200
                except:
                    response.status = 400
                    return response
            return response

class FriendSearch(APIView):
    def post(self, request, formate=None, **kwargs):
        temp = json.loads(request.body)
        friendName = temp['name']
        queryset = UserObj.objects.filter(username__startswith=friendName)
        serializer_class = UserUsername(queryset, many=True)
        print(serializer_class.data)
        return Response(serializer_class.data)

def FriendStats(request):
    try: 
        user = UserObj.objects.get(username=request.user)
        cookies = {}
        friends = user.following.all()
        for cookie in Cookie.objects.all():
            cookies[cookie.name] = 0
            for friend in friends:
                if cookie.upvotes.filter(id=friend.id).exists():
                    cookies[cookie.name] = cookies[cookie.name] + 1
    except:
        HttpResponse(status=400)
    output = dict(sorted(cookies.items(), key=lambda item: item[1], reverse=True))
    for cookie in output:
        output[cookie] = Cookie.objects.get(name=cookie).id
    print(output)
    return HttpResponse((json.dumps(output)), content_type="application/json")

def GetAverageRating(request):
    output = {}
    try:
        temp = json.loads(request.body)
        cookie = temp['cookie']
        ratings = Rating.objects.filter(cookie__id=cookie)
        value = ratings.aggregate(Avg('value'))
        output['rating'] = round(value['value__avg'], 2)
    except:
        print("Error")
    return HttpResponse(json.dumps(output), "application/json")

def GetUserRating(request):
    output = {}
    try: 
        temp = json.loads(request.body)
        cookie = temp['cookie']
        user = UserObj.objects.get(username=request.user)
        cookieRatings = Rating.objects.filter(cookie__id=cookie)
        userRating = cookieRatings.filter(user=user)
        output['userRating'] = userRating[0].value
    except:
        print("Error")
    return HttpResponse(json.dumps(output), "application/json")    

class Leaderboard(APIView):
    def get(self, request, formate=None, **kwargs):
        paginator = LimitOffsetPagination()
        paginator.page_size = 10
        queryset = sorted(Cookie.objects.all(), key=lambda a: a.rating(), reverse=True)
        result_page = paginator.paginate_queryset(queryset, request)
        serializer_class = CookieSerializers(result_page, many=True)
        return paginator.get_paginated_response(serializer_class.data)

def Logout(request):
    logout(request)
    return HttpResponseRedirect('http://127.0.0.1:5173')

def Rate(request):
    response = HttpResponse(status=200)
    try:
        temp = json.loads(request.body)
        cookieId = temp['id']
        cookieRating = temp['value']
        user = UserObj.objects.get(username=request.user)
        cookie = Cookie.objects.get(id=cookieId)
        userCookieRatings = Rating.objects.filter(user=user)
        if (userCookieRatings.filter(cookie__id=cookieId).exists()):
            userRating = userCookieRatings.get(cookie__id=cookieId)
            userRating.value = cookieRating
            userRating.save()
        else:
            Rating.objects.create(user=user, cookie=cookie, value=cookieRating)
    except:
        response.status = 400
    return response

def Register(request):
    temp = json.loads(request.body)
    requested_user = temp['username']
    requested_password = temp['password']
    password_repeat = temp['passwordRepeat']
    errors = {}
    if (len(requested_user) < 5):
        errors['validationUsername'] = "username too short"
    if (len(requested_password) < 7):
        errors['validationPassword'] = "password too short"
    if (requested_password != password_repeat):
        errors['validationPasswordRepeat'] = "passwords do not match"
    validusername = False
    if requested_user is not None and requested_user != "":
        validusername = not check_duplicate_user(requested_user)
    if validusername is False:
            errors['validationUsername'] = "username already exists"
    if validusername is True and len(errors) < 1:
        UserObj.objects.create_user(username=requested_user.strip(), password=requested_password.strip())
    return HttpResponse(json.dumps(errors), "application/json")

def Remove(request):
    response = HttpResponse()
    response.headers["cors"] = 'true'
    response.headers["Access-Control-Allow-Credentials"] = 'true'
    
    if request.method == "POST":
        body = json.loads(request.body)
        cookie_id = body['id']
        if cookie_id is None:
            response.status = 400
            return response
        try:
            user = UserObj.objects.get(username=request.user)
        except:
            response.status = 400
            return response
        if user is not None:
            duplicate_cookie = check_duplicate_favorite(int(user.id), cookie_id)
            if duplicate_cookie is True:
                try:
                    cookie = Cookie.objects.get(id=cookie_id)
                    user.user_upvotes.remove(cookie)
                    user.save()
                    response.status = 200
                except:
                    response.status = 400
                    return response
            return response

def RemoveFriend(request, usernameURL):
    response = HttpResponse(status=200)
    response.headers["cors"] = 'true'
    response.headers["Access-Control-Allow-Credentials"] = 'true'

    try:
        user = UserObj.objects.get(username=request.user)
        profile = UserObj.objects.get(username=usernameURL)
        if user != profile:
            user.following.remove(profile)
        else:
            response.status = 400
    except:
        response.status = 400
    return response

def Suggestions(request):
    try: 
        user = UserObj.objects.get(username=request.user)
        queryset = sorted(user.user_upvotes.all(), key=lambda a: a.rating(), reverse=True)
        suggestions = {}
        breakFlag = False
        for cookie in queryset:
            for u in cookie.upvotes.all():
                if u.id is not user.id and u not in suggestions and not user.following.filter(id=u.id).exists():
                    suggestions[u.username] = u.username
                    if len(suggestions) >= 10:
                        breakFlag = True
                        break
            if breakFlag is True:
                break
    except:
        return HttpResponse(status=400)
    return HttpResponse(json.dumps(suggestions), content_type="application/json")

class User(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    def get(self, request, format=None, **kwargs):
        queryset = UserObj.objects.get(username=self.kwargs['name'])
        serializer_class = UserSerializers(queryset)
        return Response(serializer_class.data)

def Who(request):
    if not request.user.is_authenticated:
        HttpResponseRedirect("http://127.0.0.1:5173/login")
    try:
        queryset = UserObj.objects.get(username=request.user)
        serializer_class = UserSerializers(queryset)
        response = HttpResponse(f'{request.user}', content_type="text/plain")
        response.headers["cors"] = 'true'
        response.headers["Access-Control-Allow-Credentials"] = 'true'
        return response
    except:
        response = HttpResponse("", content_type="text/plain")
        response.headers["cors"] = 'true'
        response.headers["Access-Control-Allow-Credentials"] = 'true'
        return response