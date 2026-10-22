"""
Django settings for config project - Olimpiada Platform
"""

import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

from django.core.exceptions import ImproperlyConfigured

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env file
load_dotenv(BASE_DIR / '.env')

# DEBUG: .env da DEBUG=True bo'lmasa, har qanday holatda False
DEBUG = os.environ.get('DEBUG', 'False').strip().lower() == 'true'

# SECRET_KEY: kodda fallback YO'Q. Production'da .env majburiy.
SECRET_KEY = os.environ.get('SECRET_KEY')
if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = 'django-insecure-local-dev-only-do-not-use-in-production'
    else:
        raise ImproperlyConfigured(
            "SECRET_KEY .env da ko'rsatilmagan. Production'da bu majburiy."
        )

ALLOWED_HOSTS = [
    'test.api.ardentsoft.uz',
    'api.hogwords.uz', 'hogwords.uz', 'www.hogwords.uz',
    'api.hogwarts.uz', 'hogwarts.uz', 'www.hogwarts.uz',
]
if DEBUG:
    # Development'da har qanday host — telefon/planshet lokal serverga LAN IP
    # orqali kirishi uchun (Wi-Fi almashganda IP o'zgaradi, qotirib bo'lmaydi).
    # Production'ga bu ta'sir qilmaydi: DEBUG=False bo'lsa yuqoridagi aniq
    # ro'yxat amal qiladi.
    ALLOWED_HOSTS = ['*']


# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    'drf_spectacular',
    'corsheaders',
    'django_filters',
    
    # Local apps
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be first
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# POSTGRES_DB berilgan bo'lsa PostgreSQL, aks holda SQLite (lokal dev).
# Olimpiada/imtihon bir vaqtda ko'p yozish qiladi — SQLite bunda
# "database is locked" beradi, shuning uchun production PostgreSQL bo'lishi kerak.
if os.environ.get('POSTGRES_DB'):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ['POSTGRES_DB'],
            'USER': os.environ.get('POSTGRES_USER', 'postgres'),
            'PASSWORD': os.environ.get('POSTGRES_PASSWORD', ''),
            'HOST': os.environ.get('POSTGRES_HOST', 'localhost'),
            'PORT': os.environ.get('POSTGRES_PORT', '5432'),
            'CONN_MAX_AGE': int(os.environ.get('POSTGRES_CONN_MAX_AGE', '60')),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }


# Custom User Model
AUTH_USER_MODEL = 'api.User'


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# Internationalization
LANGUAGE_CODE = 'uz'
TIME_ZONE = 'Asia/Tashkent'
USE_I18N = True
USE_TZ = True


# Static files
STATIC_URL = '/static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'


# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# CORS Settings
CORS_ALLOWED_ORIGINS = [
    "http://test.api.ardentsoft.uz",
    "https://test.api.ardentsoft.uz",
    "https://api.hogwords.uz",
    "https://hogwords.uz",
    "https://www.hogwords.uz",
    "https://ardent-olimpiada-course.vercel.app",
    "https://course.ardentsoft.uz",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://hogwords.uz",
    "http://www.hogwords.uz",
]
CORS_ALLOW_CREDENTIALS = True

# Security Settings
# Quyidagilar faqat production'da (DEBUG=False) yoqiladi, aks holda
# lokal http://localhost da login ishlamay qoladi.
if not DEBUG:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    X_FRAME_OPTIONS = 'DENY'



# REST Framework Settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'api.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'EXCEPTION_HANDLER': 'api.exception_handler.custom_exception_handler',
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',
        'user': '1000/day'
    }
}


SPECTACULAR_SETTINGS = {
    'TITLE': 'Hogwords Olimpiada API',
    'DESCRIPTION': 'API documentation for Hogwords Olimpiada platform',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'SERVE_PERMISSIONS': ['rest_framework.permissions.IsAdminUser'],
}

# JWT Settings
JWT_SECRET_KEY = SECRET_KEY
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_DAYS = 7


# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'apiexample@gmail.com'
EMAIL_HOST_PASSWORD = 'password'
DEFAULT_FROM_EMAIL = 'Hogwords Olimpiada <noreply@ardent.uz>'


# Wallet System Settings
COURSE_CREATION_FEE = 50000  # 50,000 so'm per course
PLATFORM_COMMISSION_RATE = 0.30  # 30% platform commission
TEACHER_COMMISSION_RATE = 0.70  # 70% teacher share
PENDING_BALANCE_DAYS = 7  # Days before funds become available
MIN_PAYOUT_AMOUNT = 100000  # Minimum withdrawal amount (100k so'm)

# Security Headers
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
# HTTPS majburlash va HSTS — development'da O'CHIQ bo'lishi shart. Ilgari
# bu yerda SECURE_SSL_REDIRECT = True qotirilgan edi, shuning uchun lokal
# http://... so'rovlar https'ga 301 bo'lib ketardi: telefon/emulyatordan
# lokal serverga ulanish ishlamasdi va testlar @override_settings talab
# qilardi. Production'da default yoqilgan, env orqali o'chirish mumkin.
if DEBUG:
    SECURE_SSL_REDIRECT = False
    SECURE_HSTS_SECONDS = 0
else:
    SECURE_SSL_REDIRECT = os.environ.get('SECURE_SSL_REDIRECT', 'True').strip().lower() == 'true'
    SECURE_HSTS_SECONDS = int(os.environ.get('SECURE_HSTS_SECONDS', '31536000'))
    if SECURE_HSTS_SECONDS:
        SECURE_HSTS_INCLUDE_SUBDOMAINS = True
        SECURE_HSTS_PRELOAD = True

# Proxy Configuration (Fix for Mixed Content / localhost URLs)
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
USE_X_FORWARDED_HOST = True
# USE_X_FORWARDED_PORT = True

CSRF_TRUSTED_ORIGINS = [
    "https://ardent-olimpiada-course.vercel.app",
    "https://course.ardentsoft.uz",
    "https://api.ardentsoft.uz",
    "https://test.api.ardentsoft.uz",
    "https://api.hogwords.uz",
    "https://hogwords.uz",
    "https://www.hogwords.uz",
    "https://api.hogwarts.uz",
    "https://hogwarts.uz",
    "https://www.hogwarts.uz",
]


# ESKIZ SMS API Config - .env dan olinadi, kodda fallback YO'Q
ESKIZ_EMAIL = os.environ.get('ESKIZ_EMAIL')
ESKIZ_PASSWORD = os.environ.get('ESKIZ_PASSWORD')
