import os
import django
import sys

# Add current directory to path
sys.path.append(os.getcwd())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.utils import timezone
from django.db.models import Sum, Avg, Count

from api.models import Olympiad, Payment, OlympiadRegistration, TestResult
from api.serializers import OlympiadSerializer
from rest_framework.test import APIRequestFactory

factory = APIRequestFactory()
request = factory.get('/')

olympiads = Olympiad.objects.all()
print(f"Total olympiads: {olympiads.count()}")

for oly in olympiads:
    try:
        print(f"Testing Olympiad ID: {oly.id} - {oly.title}")
        serializer = OlympiadSerializer(oly, context={'request': request})
        data = serializer.data
        print(f"Successfully serialized ID {oly.id}")
    except Exception as e:
        print(f"FAILED for ID {oly.id}: {str(e)}")
        import traceback
        traceback.print_exc()

