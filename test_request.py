import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import RequestFactory
from api.views import featured_courses

factory = RequestFactory()
request = factory.get('/api/courses/featured/')
try:
    response = featured_courses(request)
    print(f"Status: {response.status_code}")
    print(f"Content: {response.content}")
except Exception as e:
    import traceback
    traceback.print_exc()
