from rest_framework import serializers
from .models import *

class CookieSerializers(serializers.ModelSerializer):
    class Meta:
        model = Cookie
        fields = ['name', 'image_url', 'upvotes', 'downvotes']