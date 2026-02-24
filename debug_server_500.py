import os
import django
import sys

# Add the current directory to sys.path
sys.path.append(os.getcwd())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
try:
    django.setup()
except Exception as e:
    print(f"CRITICAL: Django setup failed: {e}")
    sys.exit(1)

from api.models import TestResult, Olympiad, Question
from api.serializers import QuestionAdminSerializer
from django.db import connection

def debug_server():
    print("--- SERVER DEBUG START ---")
    
    # 1. Check Database Schema
    print("Checking database columns for api_testresult...")
    with connection.cursor() as cursor:
        cursor.execute("PRAGMA table_info(api_testresult)") # For SQLite
        # For PostgreSQL use: "SELECT column_name FROM information_schema.columns WHERE table_name='api_testresult'"
        columns = [row[1] for row in cursor.fetchall()]
        if not columns: # Try Postgres style if SQLite returns nothing
            cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name='api_testresult'")
            columns = [row[0] for row in cursor.fetchall()]
            
        print(f"Columns in TestResult: {columns}")
        if 'feedback' in columns:
            print("SUCCESS: 'feedback' column exists in database.")
        else:
            print("FAILURE: 'feedback' column is MISSING from database.")

    # 2. Check imports
    print("\nChecking Serializer imports...")
    try:
        from api.serializers import QuestionAdminSerializer
        print("SUCCESS: QuestionAdminSerializer imported correctly.")
    except ImportError as e:
        print(f"FAILURE: Cannot import QuestionAdminSerializer: {e}")

    # 3. Test a mock serialization
    print("\nTesting Result Serialization logic...")
    try:
        res = TestResult.objects.select_related('user').first()
        if res:
            name = res.user.get_full_name().strip() or res.user.username
            test_data = {
                'id': res.id,
                'student': name,
                'feedback': getattr(res, 'feedback', 'MISSING_ATTR')
            }
            print(f"Sample data serialization check: {test_data}")
        else:
            print("No TestResults found to test.")
    except Exception as e:
        print(f"FAILURE during mock serialization: {e}")

if __name__ == "__main__":
    debug_server()
