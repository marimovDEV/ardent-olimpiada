"""Olimpiada imtihon oqimi testlari.

Qoplanadigan yo'l: ro'yxatdan o'tish -> questions -> submit -> ball.
Bu oqim mijozlar (web va mobil) haqiqatan ishlatadigan yo'l.
Backend'da yana `start`/`submit_answer`/`finish` endpoint'lari ham bor,
lekin hech bir mijoz ulardan foydalanmaydi.
"""

from django.test import TestCase, override_settings
from django.utils import timezone
from rest_framework.test import APIClient
import datetime

from api.models import (
    User,
    Olympiad,
    Question,
    OlympiadRegistration,
    TestResult,
)


@override_settings(SECURE_SSL_REDIRECT=False)
class OlympiadExamFlowTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student = User.objects.create_user(
            username='exam_student', password='testpassword', role='STUDENT'
        )
        self.teacher = User.objects.create_user(
            username='exam_teacher', password='testpassword', role='TEACHER'
        )
        self.olympiad = Olympiad.objects.create(
            title="Imtihon test olimpiadasi",
            subject="Math",
            start_date=timezone.now() - datetime.timedelta(minutes=5),
            end_date=timezone.now() + datetime.timedelta(days=1),
            status='ONGOING',
            teacher=self.teacher,
            duration=60,
            tab_switch_limit=3,
            max_attempts=1,
        )
        # Ikki savol: 2 + 3 = 5 ball
        self.q1 = Question.objects.create(
            olympiad=self.olympiad, text="2+2=?", type='MCQ',
            options=["3", "4", "5"], correct_answer="1", points=2, order=1,
        )
        self.q2 = Question.objects.create(
            olympiad=self.olympiad, text="3+3=?", type='MCQ',
            options=["5", "6", "7"], correct_answer="1", points=3, order=2,
        )

    def _register(self):
        return OlympiadRegistration.objects.create(
            user=self.student, olympiad=self.olympiad, is_paid=True
        )

    def _questions(self):
        return self.client.get(f'/api/olympiads/{self.olympiad.id}/questions/')

    def _submit(self, answers, time_taken=120, tab_switches=0):
        return self.client.post(
            f'/api/olympiads/{self.olympiad.id}/submit/',
            {'answers': answers, 'time_taken': time_taken, 'tab_switches': tab_switches},
            format='json',
        )

    # ---------- questions ----------

    def test_questions_requires_registration(self):
        """Ro'yxatdan o'tmagan o'quvchi 403 oladi (401 emas).

        Bu muhim: mobil ilovaning API client'i avval 403 da ham token o'chirib
        foydalanuvchini login'ga uloqtirardi. Endpoint tokenni emas, ruxsatni
        rad etadi, shuning uchun 403 logout sababi bo'lmasligi kerak.
        """
        self.client.force_authenticate(user=self.student)
        response = self._questions()

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data['error'], 'error.not_registered')

    def test_questions_returns_duration_at_top_level(self):
        """Mijoz taymeri top-level `duration` ga tayanadi."""
        self._register()
        self.client.force_authenticate(user=self.student)
        response = self._questions()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['duration'], 60)
        self.assertEqual(len(response.data['questions']), 2)
        self.assertEqual(response.data['olympiad']['tab_switch_limit'], 3)

    def test_questions_does_not_leak_correct_answers(self):
        self._register()
        self.client.force_authenticate(user=self.student)
        response = self._questions()

        for question in response.data['questions']:
            self.assertNotIn('correct_answer', question)

    # ---------- submit / ball ----------

    def test_submit_scores_only_correct_answers(self):
        self._register()
        self.client.force_authenticate(user=self.student)

        response = self._submit({str(self.q1.id): "1", str(self.q2.id): "0"})

        self.assertIn(response.status_code, (200, 201))
        result = TestResult.objects.get(user=self.student, olympiad=self.olympiad)
        self.assertEqual(result.score, 2)          # faqat q1 to'g'ri
        self.assertEqual(float(result.percentage), 40.0)   # 2 / 5
        self.assertEqual(result.status, 'COMPLETED')

    def test_submit_disqualifies_when_over_tab_switch_limit(self):
        self._register()
        self.client.force_authenticate(user=self.student)

        response = self._submit({str(self.q1.id): "1"}, tab_switches=4)

        self.assertIn(response.status_code, (200, 201))
        result = TestResult.objects.get(user=self.student, olympiad=self.olympiad)
        self.assertEqual(result.status, 'DISQUALIFIED')

    def test_submit_allows_tab_switches_up_to_limit(self):
        self._register()
        self.client.force_authenticate(user=self.student)

        self._submit({str(self.q1.id): "1"}, tab_switches=3)

        result = TestResult.objects.get(user=self.student, olympiad=self.olympiad)
        self.assertEqual(result.status, 'COMPLETED')

    def test_second_submit_rejected_when_single_attempt(self):
        self._register()
        self.client.force_authenticate(user=self.student)
        self._submit({str(self.q1.id): "1"})

        response = self._submit({str(self.q1.id): "1", str(self.q2.id): "1"})

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], 'error.already_submitted')
        result = TestResult.objects.get(user=self.student, olympiad=self.olympiad)
        self.assertEqual(result.score, 2)   # birinchi natija saqlanib qoldi


@override_settings(SECURE_SSL_REDIRECT=False)
class OlympiadExamServerTimingTest(TestCase):
    """Imtihon vaqti server tomonida nazorat qilinishi kerak.

    Mijozdagi taymer ishonchli emas: o'quvchi ilovani o'chirib qayta ochsa
    taymer noldan boshlanadi, va `time_taken` ni ham mijozning o'zi yuboradi.
    """

    def setUp(self):
        self.client = APIClient()
        self.student = User.objects.create_user(
            username='timing_student', password='testpassword', role='STUDENT'
        )
        self.olympiad = Olympiad.objects.create(
            title="Vaqt nazorati testi",
            subject="Math",
            start_date=timezone.now() - datetime.timedelta(minutes=5),
            end_date=timezone.now() + datetime.timedelta(days=1),
            status='ONGOING',
            duration=30,
            max_attempts=1,
        )
        self.q1 = Question.objects.create(
            olympiad=self.olympiad, text="2+2=?", type='MCQ',
            options=["3", "4"], correct_answer="1", points=1, order=1,
        )
        OlympiadRegistration.objects.create(
            user=self.student, olympiad=self.olympiad, is_paid=True
        )
        self.client.force_authenticate(user=self.student)

    def _questions(self):
        return self.client.get(f'/api/olympiads/{self.olympiad.id}/questions/')

    def _submit(self, time_taken=60):
        return self.client.post(
            f'/api/olympiads/{self.olympiad.id}/submit/',
            {'answers': {str(self.q1.id): "1"}, 'time_taken': time_taken, 'tab_switches': 0},
            format='json',
        )

    def test_questions_records_started_at(self):
        """Savollar birinchi olinganda server boshlanish vaqtini yozib qo'yadi."""
        self._questions()

        attempt = TestResult.objects.get(user=self.student, olympiad=self.olympiad)
        self.assertEqual(attempt.status, 'IN_PROGRESS')
        self.assertIsNotNone(attempt.started_at)

    def test_questions_returns_started_at_to_client(self):
        """Mijoz taymerni server bergan vaqtdan hisoblashi uchun."""
        response = self._questions()

        self.assertEqual(response.status_code, 200)
        self.assertIn('started_at', response.data)
        self.assertIsNotNone(response.data['started_at'])

    def test_refetching_questions_does_not_reset_the_clock(self):
        """Ilovani o'chirib qayta ochish taymerni noldan boshlamaydi."""
        self._questions()
        original = TestResult.objects.get(
            user=self.student, olympiad=self.olympiad
        ).started_at

        self._questions()

        again = TestResult.objects.get(
            user=self.student, olympiad=self.olympiad
        ).started_at
        self.assertEqual(original, again)

    def test_time_taken_is_computed_by_server_not_client(self):
        """Mijoz yuborgan time_taken e'tiborga olinmaydi."""
        self._questions()
        attempt = TestResult.objects.get(user=self.student, olympiad=self.olympiad)
        attempt.started_at = timezone.now() - datetime.timedelta(minutes=10)
        attempt.save(update_fields=['started_at'])

        # Mijoz "1 sekundda yechdim" deb yuboradi
        self._submit(time_taken=1)

        attempt.refresh_from_db()
        self.assertGreater(attempt.time_taken, 500)   # ~600 sekund

    def test_submit_after_duration_is_flagged_for_review(self):
        """Muddatdan keyin kelgan javob avtomatik rad etilmaydi, tekshiruvga qo'yiladi.

        Avtomatik diskvalifikatsiya qilmaymiz: internet uzilishi ham shu holatni
        beradi, shuning uchun qarorni o'qituvchi qabul qilsin.
        """
        self._questions()
        attempt = TestResult.objects.get(user=self.student, olympiad=self.olympiad)
        # 30 daqiqalik imtihon, 2 soat oldin boshlangan
        attempt.started_at = timezone.now() - datetime.timedelta(hours=2)
        attempt.save(update_fields=['started_at'])

        response = self._submit()

        self.assertIn(response.status_code, (200, 201))
        attempt.refresh_from_db()
        self.assertEqual(attempt.status, 'CHECKING')

    def test_submit_within_duration_completes_normally(self):
        self._questions()

        response = self._submit()

        self.assertIn(response.status_code, (200, 201))
        attempt = TestResult.objects.get(user=self.student, olympiad=self.olympiad)
        self.assertEqual(attempt.status, 'COMPLETED')
        self.assertEqual(attempt.score, 1)


@override_settings(SECURE_SSL_REDIRECT=False)
class InProgressAttemptsExcludedFromStatsTest(TestCase):
    """Tugallanmagan urinish statistikaga va reytingga tushmasligi kerak.

    `questions` endpoint endi IN_PROGRESS yozuv yaratadi. Bundan oldin
    TestResult faqat topshirilgandan keyin paydo bo'lardi, shuning uchun
    barcha hisob-kitob so'rovlari IN_PROGRESS ni chetlab o'tishi shart —
    aks holda qatnashchilar soni va reyting buziladi.
    """

    def setUp(self):
        self.client = APIClient()
        self.teacher = User.objects.create_user(
            username='stats_teacher', password='testpassword', role='TEACHER'
        )
        self.finished = User.objects.create_user(
            username='stats_finished', password='testpassword', role='STUDENT'
        )
        self.in_progress = User.objects.create_user(
            username='stats_in_progress', password='testpassword', role='STUDENT'
        )
        self.olympiad = Olympiad.objects.create(
            title="Statistika testi",
            subject="Math",
            start_date=timezone.now() - datetime.timedelta(minutes=5),
            end_date=timezone.now() + datetime.timedelta(days=1),
            status='PUBLISHED',
            teacher=self.teacher,
            duration=60,
        )
        # Topshirgan o'quvchi
        TestResult.objects.create(
            user=self.finished, olympiad=self.olympiad,
            score=80, percentage=80, status='COMPLETED',
        )
        # Hali yechayotgan o'quvchi
        TestResult.objects.create(
            user=self.in_progress, olympiad=self.olympiad,
            score=0, percentage=0, status='IN_PROGRESS',
            started_at=timezone.now(),
        )

    def test_leaderboard_excludes_in_progress(self):
        response = self.client.get(f'/api/olympiads/{self.olympiad.id}/leaderboard/')

        self.assertEqual(response.status_code, 200)
        usernames = [row['student'] for row in response.data['leaderboard']]
        self.assertIn('stats_finished', usernames)
        self.assertNotIn('stats_in_progress', usernames)

    def test_participants_count_excludes_in_progress(self):
        response = self.client.get(f'/api/olympiads/{self.olympiad.id}/leaderboard/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['participants_count'], 1)

    def test_disqualified_results_still_counted(self):
        """exclude(IN_PROGRESS) ishlatamiz, status='COMPLETED' emas —
        diskvalifikatsiya qilinganlar hisobdan tushib qolmasligi kerak."""
        disqualified = User.objects.create_user(
            username='stats_disqualified', password='testpassword', role='STUDENT'
        )
        TestResult.objects.create(
            user=disqualified, olympiad=self.olympiad,
            score=10, percentage=10, status='DISQUALIFIED',
        )

        response = self.client.get(f'/api/olympiads/{self.olympiad.id}/leaderboard/')

        self.assertEqual(response.data['participants_count'], 2)
