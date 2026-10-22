"""Login endpoint'i qabul qiladigan identifikatorlar.

Mobil ilova `{phone, password}` yuboradi, web esa `{email|username, password}`.
Uchalasi ham ishlashi kerak.
"""

from django.test import TestCase, override_settings
from django.contrib.auth.hashers import make_password
from rest_framework.test import APIClient

from api.models import User


@override_settings(SECURE_SSL_REDIRECT=False)
class LoginIdentifierTest(TestCase):
    PASSWORD = 'testpassword123'

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            username='login_student',
            email='login_student@hogwords.uz',
            phone='+998901112233',
            password=make_password(self.PASSWORD),
            role='STUDENT',
        )

    def _login(self, payload):
        return self.client.post('/api/auth/login/', payload, format='json')

    def test_login_with_phone_field(self):
        """Mobil ilova aynan shu shaklda yuboradi.

        Ilgari `phone` UserLoginSerializer'da e'lon qilinmagani uchun DRF uni
        jimgina tashlab yuborardi — natijada mobil ilovadan login umuman
        ishlamasdi (401).
        """
        response = self._login({'phone': '+998901112233', 'password': self.PASSWORD})

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['user']['username'], 'login_student')
        self.assertIn('token', response.data)

    def test_login_with_email_field(self):
        response = self._login({'email': 'login_student@hogwords.uz', 'password': self.PASSWORD})

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['success'])

    def test_login_with_username_field(self):
        response = self._login({'username': 'login_student', 'password': self.PASSWORD})

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['success'])

    def test_login_with_phone_in_email_field_still_works(self):
        """Web'da telefon email maydonida kelishi mumkin — buzilmasligi kerak."""
        response = self._login({'email': '+998901112233', 'password': self.PASSWORD})

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['success'])

    def test_login_rejects_wrong_password(self):
        response = self._login({'phone': '+998901112233', 'password': 'wrong-password'})

        self.assertEqual(response.status_code, 401)
        self.assertFalse(response.data['success'])

    def test_login_rejects_unknown_phone(self):
        response = self._login({'phone': '+998900000000', 'password': self.PASSWORD})

        self.assertEqual(response.status_code, 401)
        self.assertFalse(response.data['success'])
