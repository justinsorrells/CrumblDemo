#!/bin/bash

python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic

gunicorn final.wsgi:application --bind 0.0.0.0:8000