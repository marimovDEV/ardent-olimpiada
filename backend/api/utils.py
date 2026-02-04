import random
import string

def generate_unique_id(prefix, length=6):
    """Generate unique ID like CRT-123456"""
    chars = string.digits
    random_part = ''.join(random.choices(chars, k=length))
    return f"{prefix}-{random_part}"
