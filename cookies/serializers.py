from rest_framework import serializers
from .models import *

class CookieSerializers(serializers.ModelSerializer):
    rating = serializers.FloatField(min_value=0, max_value=5)
    class Meta:
        model = Cookie
        fields = ['rating', 'id', 'name', 'description', 'image_url', 'upvotes', 'downvotes']

class UserFollowing(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'user_upvotes']

class UserSerializers(serializers.ModelSerializer):
    following = UserFollowing(read_only=True, many=True)
    class Meta:
        model = User
        fields = ['username', 'user_upvotes', 'user_downvotes', 'following']
        depth = 1

class UserUsername(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']

