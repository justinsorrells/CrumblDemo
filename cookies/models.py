from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator 
# Create your models here.

class User(AbstractUser):
    pass 

class Cookie(models.Model):
    name = models.CharField(max_length= 100, validators=[MinLengthValidator(1)])
    image_url = models.CharField(max_length = 1000)
    upvotes = models.ManyToManyField(User, related_name="user_upvotes")
    downvotes = models.ManyToManyField(User, related_name="user_downvotes")