from utils.helpers import *
setup()

from cookies.models import *
import requests
from bs4 import BeautifulSoup

URL = "https://crumblcookies.com/"
page = requests.get(URL)
soup = BeautifulSoup(page.content, "html.parser")
main = soup.find(id="weekly-cookie-flavors")
cookies = main.find_all("li")

cookie_objs = process_cookies(cookies)
print_objs(cookie_objs)
submit_cookies(cookie_objs)