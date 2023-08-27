from django.db import models
from django.db.models import Avg
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator, MinValueValidator, MaxValueValidator
# Create your models here.

class User(AbstractUser):
    following = models.ManyToManyField("self", related_name="follow", symmetrical=False)

    def __str__(self):
        return self.username

class Cookie(models.Model):
    name = models.CharField(max_length= 100, validators=[MinLengthValidator(1)])
    image_url = models.CharField(max_length = 1000)
    description = models.CharField(max_length= 1000, validators=[MinLengthValidator(1)])
    upvotes = models.ManyToManyField(User, related_name="user_upvotes")
    downvotes = models.ManyToManyField(User, related_name="user_downvotes")

    def rating(self):
        data = 0
        ratings = Rating.objects.filter(cookie__id=self.id)
        if ratings:
            rating = ratings.aggregate(Avg("value"))
            rating = rating['value__avg']
            data = round(rating, 2)
        return data

class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cookie = models.ForeignKey(Cookie, on_delete=models.CASCADE)
    value = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])