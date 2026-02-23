import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Profession
from api.serializers import ProfessionSerializer

professions = Profession.objects.all()
try:
    data = ProfessionSerializer(professions, many=True).data
    print("Serialization successful!")
except Exception as e:
    import traceback
    traceback.print_exc()

