"""Olimpiada endpointlarining ruxsatlari.

Ilgari OlympiadViewSet.get_permissions ro'yxatida bo'lmagan har qanday action'ni
[AllowAny()] ga tushirardi va shu bilan @action(permission_classes=...) ichida
yozilgan himoyani butunlay bekor qilardi. Natijada 24 ta action anonim ochiq edi:
get_questions to'g'ri javoblarni qaytarardi, ranking telefon raqamlarini,
force_start va publish_results'ni esa istalgan kishi POST qila olardi.

Shu bilan birga savol qo'shish ikki joyda admin'ga qotib qolgan edi:
QuestionViewSet DRF'ning IsAdminUser'ini (is_staff) ishlatardi, add_question esa
tanasida `role != 'ADMIN'` tekshiruvi bilan o'qituvchini rad etardi — natijada
o'qituvchi olimpiada ustasi orqali savol yuklay olmasdi.
"""

from datetime import timedelta

from django.contrib.auth.hashers import make_password
from django.test import TestCase, override_settings
from django.utils import timezone
from rest_framework.test import APIClient

from api.models import Olympiad, Question, Subject, User


PASSWORD = 'testpassword123'


def make_user(username, role, phone):
    return User.objects.create(
        username=username,
        email=f'{username}@hogwords.uz',
        phone=phone,
        password=make_password(PASSWORD),
        role=role,
    )


@override_settings(SECURE_SSL_REDIRECT=False)
class OlympiadAnonymousAccessTest(TestCase):
    """Anonim foydalanuvchi himoyalangan action'larga yetib bormasligi kerak."""

    def setUp(self):
        self.client = APIClient()
        subject = Subject.objects.create(name='Matematika')
        self.olympiad = Olympiad.objects.create(
            title='Ruxsat testi', description='x', subject_id=subject,
            duration=30, is_active=True, status='UPCOMING',
            start_date=timezone.now() + timedelta(days=1),
            end_date=timezone.now() + timedelta(days=2), price=0,
        )
        Question.objects.create(
            olympiad=self.olympiad, text='2+2=?', options=['3', '4'],
            correct_answer='1', points=1, order=1,
        )

    def test_anonymous_cannot_read_questions_with_answers(self):
        """Eng xavflisi: get_questions correct_answer'ni qaytaradi."""
        response = self.client.get(f'/api/olympiads/{self.olympiad.id}/get_questions/')

        self.assertIn(response.status_code, (401, 403))
        self.assertNotIn(b'correct_answer', response.content)

    def test_anonymous_cannot_read_ranking(self):
        """Ranking ishtirokchilarning telefon raqamlarini qaytaradi."""
        response = self.client.get(f'/api/olympiads/{self.olympiad.id}/ranking/')

        self.assertIn(response.status_code, (401, 403))

    def test_anonymous_cannot_read_admin_stats(self):
        response = self.client.get('/api/olympiads/admin_stats/')

        self.assertIn(response.status_code, (401, 403))

    def test_anonymous_cannot_force_start(self):
        """Yozish action'i — anonim kishi olimpiadani boshlab yubora olmasin."""
        response = self.client.post(f'/api/olympiads/{self.olympiad.id}/force_start/')

        self.assertIn(response.status_code, (401, 403))
        self.olympiad.refresh_from_db()
        self.assertEqual(self.olympiad.status, 'UPCOMING')

    def test_anonymous_cannot_publish_results(self):
        response = self.client.post(f'/api/olympiads/{self.olympiad.id}/publish_results/')

        self.assertIn(response.status_code, (401, 403))

    def test_anonymous_cannot_create_question(self):
        response = self.client.post('/api/questions/', {
            'olympiad': self.olympiad.id, 'text': 'x',
            'options': ['1', '2'], 'correct_answer': '0',
        }, format='json')

        self.assertIn(response.status_code, (401, 403))
        self.assertEqual(Question.objects.filter(olympiad=self.olympiad).count(), 1)

    def test_public_endpoints_stay_public(self):
        """Ommaviy sahifalar buzilmasligi kerak — tuzatish ularni yopmagan."""
        for url in (
            '/api/olympiads/',
            f'/api/olympiads/{self.olympiad.id}/',
            f'/api/olympiads/{self.olympiad.id}/leaderboard/',
        ):
            with self.subTest(url=url):
                self.assertEqual(self.client.get(url).status_code, 200)


@override_settings(SECURE_SSL_REDIRECT=False)
class TeacherQuestionManagementTest(TestCase):
    """O'qituvchi o'z olimpiadasiga savol qo'sha olishi kerak, boshqaga esa yo'q."""

    def setUp(self):
        self.client = APIClient()
        subject = Subject.objects.create(name='Matematika')
        self.teacher = make_user('perm_teacher', 'TEACHER', '+998901110001')
        self.other_teacher = make_user('perm_teacher2', 'TEACHER', '+998901110002')
        self.student = make_user('perm_student', 'STUDENT', '+998901110003')

        def olympiad(title, owner):
            return Olympiad.objects.create(
                title=title, description='x', subject_id=subject, duration=30,
                is_active=True, status='UPCOMING',
                start_date=timezone.now() + timedelta(days=1),
                end_date=timezone.now() + timedelta(days=2),
                price=0, teacher=owner,
            )

        self.own = olympiad('O\'zimning olimpiadam', self.teacher)
        self.foreign = olympiad('Boshqaning olimpiadasi', self.other_teacher)

    def auth(self, user):
        response = self.client.post('/api/auth/login/',
                                    {'phone': user.phone, 'password': PASSWORD},
                                    format='json')
        self.assertEqual(response.status_code, 200, response.data)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['token']}")

    def question_payload(self, olympiad):
        return {'olympiad': olympiad.id, 'text': '5*5=?',
                'options': ['20', '25'], 'correct_answer': '1', 'points': 2, 'order': 1}

    def test_teacher_can_create_question_for_own_olympiad(self):
        """Foydalanuvchi aytgan nuqson aynan shu yerda edi."""
        self.auth(self.teacher)

        response = self.client.post('/api/questions/',
                                    self.question_payload(self.own), format='json')

        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(Question.objects.filter(olympiad=self.own).count(), 1)

    def test_teacher_cannot_create_question_for_foreign_olympiad(self):
        self.auth(self.teacher)

        response = self.client.post('/api/questions/',
                                    self.question_payload(self.foreign), format='json')

        self.assertEqual(response.status_code, 403)
        self.assertEqual(Question.objects.filter(olympiad=self.foreign).count(), 0)

    def test_teacher_question_list_is_scoped_to_own_olympiads(self):
        Question.objects.create(olympiad=self.own, text='a', options=['1'],
                                correct_answer='0', points=1, order=1)
        Question.objects.create(olympiad=self.foreign, text='b', options=['1'],
                                correct_answer='0', points=1, order=1)
        self.auth(self.teacher)

        response = self.client.get('/api/questions/')

        self.assertEqual(response.status_code, 200)
        # Javob sahifalangan bo'lishi ham mumkin.
        rows = response.data['results'] if isinstance(response.data, dict) else response.data
        self.assertEqual({q['text'] for q in rows}, {'a'})

    def test_teacher_can_use_add_question_action(self):
        self.auth(self.teacher)

        response = self.client.post(f'/api/olympiads/{self.own.id}/add_question/',
                                    self.question_payload(self.own), format='json')

        self.assertEqual(response.status_code, 201, response.data)

    def test_teacher_cannot_add_question_to_foreign_olympiad(self):
        self.auth(self.teacher)

        response = self.client.post(f'/api/olympiads/{self.foreign.id}/add_question/',
                                    self.question_payload(self.foreign), format='json')

        self.assertEqual(response.status_code, 403)

    def test_teacher_can_read_own_questions_with_answers(self):
        Question.objects.create(olympiad=self.own, text='a', options=['1', '2'],
                                correct_answer='1', points=1, order=1)
        self.auth(self.teacher)

        response = self.client.get(f'/api/olympiads/{self.own.id}/get_questions/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['correct_answer'], '1')

    def test_student_cannot_create_question(self):
        self.auth(self.student)

        response = self.client.post('/api/questions/',
                                    self.question_payload(self.own), format='json')

        self.assertEqual(response.status_code, 403)
        self.assertEqual(Question.objects.filter(olympiad=self.own).count(), 0)

    def test_student_cannot_read_answers(self):
        Question.objects.create(olympiad=self.own, text='a', options=['1', '2'],
                                correct_answer='1', points=1, order=1)
        self.auth(self.student)

        response = self.client.get(f'/api/olympiads/{self.own.id}/get_questions/')

        self.assertEqual(response.status_code, 403)
