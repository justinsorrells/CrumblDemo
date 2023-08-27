Distinctiveness and Complexity
I believe the aspect of my project that contributed the most to the complexity was the separation of the front and backend. Throughout the project, I utilized Django's REST framework to assist me in manipulating my models so that the user could view abd interact with them. I chose to separate my front and backend on a whim to learn more about how APIs work, and I learned more than I could of possibly imagined. I think overall my codebase for this project is a train wreck, but I think I gained a significant amount of knowledge about how I will tackle large scale projects moving forward. I should have spent more time upfront designing my backend APIs so that I could have utilized CRUD operations on less end points overall.

From the top, my project scrapes the Crumbl website using my program scraper.py found in cookies/scraper.py. It downloads the cookie image to a file just in case Crumbl ever changes the image hyperlinks and creates a new cookie object to store the name, ID, image link, and description (This can be automated with a CRON Job to ensure weekly pulls). From here, my views act as endpoints for my react frontend to communicate with.

To operate most of the website Users will need to register and then login. Once logged in, Users will be able to view all of the cookies alphabetically as well as search for cookies, see a leaderboard to see how the community rates the cookies overall, and view their "friends" favorite cookies. Both the homepage and leaderboard implement an infinite scroll so that the cookies load as the user scrolls. Unfortunately, my implementation of the individual user page has led to difficulties in implementing the infinite scroll, but it could be accomplished with refactoring.

All cookies have individual detail pages from which the User can rate the cookie out of 5 stars and favorite or unfavorite the cookie. If the user has already rated or favorited any cookie, then this will be pre-loaded when the user accesses the individual cookie page. 

On the friend page, there are "Friends' stats" which display the 3 most favorited and least favorited cookies by a User's friends. This was placed to act as a suggestion to Users for cookies to try and perhaps cookies to avoid. In addition to "Friends' stats", there is also a list of "Suggested Friends". "Suggested Friends" are compiled by looking at the User's highest rated cookies and seeing who else has favorited them.

Again, most of my complexity lies in the communication of the front and backend. I faced a lot of challenges early on such as creating an endpoint to get a CSRF token from django and plenty of CORS issues to boot. In addition to those, another HUGE challenge for me was asynchronous programming in Javascript. Getting components to load in the UI required a lot of time spent learning about promises.

There are some additional features I would like to add to the project like comments on the individual cookie pages, filters to help sort the cookies when a user wants to scroll, a weekly cookie page, and some form of additional user interaction. However, I also feel that my project is kind of infinitely growing in scope. Every time I approach an endpoint it seems there is always one more thing to do. This project has taught me a tremendous amount and I do not wish to refactor this codebase. I am ready to move forward in my coding journey, so I decided to go ahead and submit my CS50W project.

BACKEND (cookies/): 
In scrapery.py, there is my code to scrape the Crumbl website and create cookie objects. This code also relies on functions from utils/helpers

Models.py contains my three current models (I expect a Comment models to be added in the future). However, currently there is a User model, a Cookie model, and a Rating model. All of which are linked together. Users and Cookies have a ManyToMany relationship and Users and Cookies are linked to Ratings by a OneToOne relationsihp (We only one rating per user per cookie).

Serializers.py serializes my models to be converted into json. This method made it very easy to send data down to the user interface. (For future projects, I would try to stick to CRUD operations within the serializers)

Urls.py contains standard paths to designate which function will operate at which endpoint.

Views.py acts as gateways to my serializers, as well as other custom functions. I didn't utilize my serializers enough, so many of my view functions act on my models independently of a serializer.

FRONTEND (finalFront/cookie/src): 
APIHelpers.jsx contains a handful of helper function used through my frontend code, such as getUserFromURI(). This function monitors when the URI changes and recalls fetch to get the new User's profile information. It also contains the very useful getCSRFCookie(), which is called wherever post requests are made. Without this function, django would not allow my frontend to communicate with the server.

App.jsx is my homepage. This page has a cookie search bar and allows users to scroll through all of the cookies alphabetically. The page does implement an infinite scroll feature and allows users to favorite any cookies they like. Users can also click the cookie box to be taken to the individual cookie page.

Cookie.jsx is the individual cookie page. This page displays the cookie card, the user rating if there is one, the community rating, and allows the user to rate and favorite cookies.

Csrf.jsx is the CSRF token component called on everypage. It is called on the Navbar component because it is present on every page as well.

Custom.scss contains a handful of modifications to bootstrap css. There were certain aesthetic details that I wanted to modify.

Friends.jsx contains the code to display the friend page. It shows the "Friend Stats", all of a User's friends, suggested friends, and allows the user to search all users.

Leaderboard.jsx displays all of the cookies ranked from highest ratings to lowest ratings. Users can click on individual cookie pages throughout the leaderboard to rate the cookies themselves. 

Login.jsx contains the form for a user to attempt authentication.There is a hidden amount of complexity in both the login and register code because I implemented server side error messages.

Navbar.jsx contains the code for the navigation menu at the top of the website as well as calls the CSRF token.

Register.jsx contains the code for a User to attempt to register a new account. There is a hidden amount of complexity in both the login and register code because I implemented server side error messages.

UserProfile.jsx contains the code for a User's profile. Unfortunately, the way I implemented the User profile endpoint makes infinite scrolling quite a bit different than on the Leaderboard and App components. This page allows Users' to favorite their other User's favorite cookies as well as see what favorites they have in common. User's can also add the User as a friend or remove them as a friend.

Who.jsx contains the code that checks to see who the current User is as well as information pertaining to the currently logged in User.

WHY:
I chose this project because I enjoy Crumbl cookies and my friends and I have very different opinions regarding the cookies. I thought it would be fun to create a community leadboard, so I could get to the bottom of what the top and bottom cookies actually are.

TO RUN: 
Go into the finalFront/cookies folder and run "npm install" to get the dev dependencies, then run "npm run dev" in the command line. 

In the main folder, run python manage.py runserver. Your server will need to run at 127.0.0.1:8000 (In retrospect this should have been an environmental variable or at least grabbed from a configuraiton file)
