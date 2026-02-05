import os
import sys
import django

# Set up Django environment
sys.path.append('/root/ogabek/test/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import User

def fix_admin():
    username = 'admin'
    try:
        user = User.objects.get(username=username)
        print(f"Found user: {user.username}")
        user.role = 'ADMIN'
        user.is_staff = True
        user.is_superuser = True
        user.save()
        print(f"Successfully updated {username}: role=ADMIN, is_staff=True, is_superuser=True")
    except User.DoesNotExist:
        print(f"User {username} not found. Creating a new one...")
        user = User.objects.create_superuser(username=username, password='admin', email='tech@ardent.uz')
        user.role = 'ADMIN'
        user.save()
        print(f"Successfully created superuser {username} with role=ADMIN")

if __name__ == "__main__":
    fix_admin()
