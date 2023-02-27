from rest_framework import serializers
from . import models

class CookieSerializers(serializers.ModelSerializer):
    class Meta:
        model = models.Cookie
        fields = ['name', 'image_url', 'upvotes', 'downvotes']