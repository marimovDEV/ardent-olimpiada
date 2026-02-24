import os
import django
import sys
from decimal import Decimal

# Add the current directory to sys.path
sys.path.append(os.getcwd())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
try:
    django.setup()
except Exception as e:
    print(f"CRITICAL: Django setup failed: {e}")
    sys.exit(1)

from api.models import TestResult, Olympiad
from django.db import connection

def debug_decimal_issue():
    print("--- DECIMAL FIELD DEBUG START ---")
    
    # We will fetch raw values to see what's actually in the DB
    with connection.cursor() as cursor:
        print("Fetching raw values from api_testresult table...")
        cursor.execute("SELECT id, percentage, score FROM api_testresult")
        rows = cursor.fetchall()
        
        found_bad = False
        for row in rows:
            rid, percentage, score = row
            try:
                # Try to convert what's in the DB to Decimal
                if percentage is not None:
                    d = Decimal(str(percentage))
                print(f"ID: {rid} | Original: {percentage} ({type(percentage)}) | Score: {score}")
            except Exception as e:
                print(f"!!! BAD DATA FOUND at ID {rid} !!!")
                print(f"Value: {percentage} | Error: {e}")
                found_bad = True
        
        if not found_bad:
            print("\nNo corrupted 'percentage' strings found in local raw fetch.")
            print("Trying to materialize models one by one...")
            for res in TestResult.objects.all():
                try:
                    p = res.percentage
                except Exception as e:
                    print(f"!!! FAILED TO MATERIALIZE ID {res.id} !!!")
                    print(f"Error: {e}")
                    # We can't actually get res.id if materialize fails usually, 
                    # but let's see if we can catch it.

if __name__ == "__main__":
    debug_decimal_issue()
