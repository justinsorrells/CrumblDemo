import sys
sys.path.append("/Users/Dani/CS50W/final")
import requests
import os 
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "final.settings")
import django
django.setup()
import shutil
from PIL import Image
sys.path.append("/Users/Dani/CS50W/cookies")
from cookies.models import * 

def setup():
	import sys
	sys.path.append("/Users/Dani/CS50W/final")
	from final import settings
	import os 
	os.environ.setdefault("DJANGO_SETTINGS_MODULE", "final.settings")
	import django
	django.setup()
	sys.path.append("/Users/Dani/CS50W/cookies")

def print_objs(cookie_objs):
	for obj in cookie_objs:
		for key in list(obj.keys()):
			print(obj[key])

def process_cookies(cookies):
	cookie_objs = []
	for cookie in cookies:
		cookie_name = cookie.find("h3")
		cookie_image = cookie.find("img")
		cookie_description = cookie.find("p")
		if cookie_image and cookie_name and cookie_description:
			cookie_obj = {
				"cookie_name": cookie_name.text,
				"cookie_image": cookie_image["src"],
				"cookie_description": cookie_description.text,
			}
			cookie_objs.append(cookie_obj)
	return cookie_objs

def check_duplicate_cookie(cookie_name):
	if Cookie.objects.filter(name=cookie_name):
		return True 
	else:
		return False

def check_null_cookie(cookie_obj):
	if not cookie_obj["cookie_name"] or not cookie_obj["cookie_image"]:
		return False 
	else:
		return True

def check_valid(cookie_obj):
		if not check_duplicate_cookie(cookie_obj["cookie_name"]) and check_null_cookie(cookie_obj):
			return True 
		else:
			return False

def submit_cookies(cookie_objs):
	for obj in cookie_objs:
		if check_valid(obj):
			Cookie.objects.create(name=obj["cookie_name"], image_url=obj["cookie_image"], description=obj["cookie_description"])
	save_images(cookie_objs)

def save_images(cookie_objs):
	for cookie in cookie_objs:
		pic = requests.get(cookie["cookie_image"], stream = True)
		filepath = f'/Users/Dani/CS50W/final/cookies/static/images/{cookie["cookie_name"]}.png'
		try:
			with open(filepath, 'wb') as f:
				shutil.copyfileobj(pic.raw, f)
		except:
			f = open(filepath, "x")
			fclose(f)
			with open(filepath, 'wb') as f:
				shutil.copyfileobj(pic.raw, f)

def check_duplicate_user(requested_user):
	if User.objects.filter(username=requested_user):
		return True 
	else:
		return False

def check_duplicate_favorite(user, requested_id):
	try:
		user = User.objects.get(id=user)
	except:
		return True
	if user.user_upvotes.filter(id=requested_id):
		return True 
	else:
		return False