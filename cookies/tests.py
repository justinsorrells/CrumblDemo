from django.test import TestCase, Client
from .models import *

# Create your tests here.
class LoginTestCase(TestCase):
    def setUp(self):
        user = User.objects.create(username="test1")
        user.set_password("test1")
        user.save()

    def testUserCreated(self):
        user = User.objects.get(username="test1")
        self.assertEqual(user.username, "test1")

    def testSignIn(self):
        c = Client()
        status = c.login(username="test1", password="test1")
        self.assertEqual(status, True)

class RegistrationTestCase(TestCase):
    def setUp(self):

