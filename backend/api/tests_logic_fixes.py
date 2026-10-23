"""Mantiqiy xatolar uchun regressiya testlari.

Bu fayldagi har bir test oldin HAQIQATAN buzilgan bo'lgan xatti-harakatni
qamrab oladi. Tavsif ichida "ilgari" deb yozilgan joy — tuzatishdan oldin
qanday ishlagani.
"""

import datetime
from decimal import Decimal

from django.test import TestCase, override_settings
from django.utils import timezone
from rest_framework.test import APIClient

from api.models import (
    Course,
    Enrollment,
    Lesson,
    LessonProgress,
    LessonTest,
    Module,
    Olympiad,
    OlympiadRegistration,
    Payment,
    Question,
    TestResult,
    User,
)
from api.services.learning_service import LearningService
from api.services.olympiad_service import OlympiadService


@override_settings(SECURE_SSL_REDIRECT=False)
class OlympiadRetakeTest(TestCase):
    """max_attempts > 1 bo'lganda qayta topshirish ishlashi kerak.

    Ilgari: TestResult da urinish hisoblagichi yo'q edi. max_attempts = 1
    bo'lsa o'quvchi umuman qayta topshira olmasdi, max_attempts > 1 bo'lsa
    esa CHEKSIZ marta topshirardi va har safar oldingi natija yo'q bo'lardi.
    Bundan tashqari `started_at` qayta boshlanmagani uchun ikkinchi
    urinishga vaqt qolmasdi.
    """

    def setUp(self):
        self.client = APIClient()
        self.student = User.objects.create_user(
            username='retake_student', password='x', role='STUDENT'
        )
        self.olympiad = Olympiad.objects.create(
            title="Qayta topshirish testi",
            start_date=timezone.now() - datetime.timedelta(minutes=5),
            end_date=timezone.now() + datetime.timedelta(days=1),
            status='ONGOING',
            duration=60,
            max_attempts=2,
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

    def _submit(self, answer):
        return self.client.post(
            f'/api/olympiads/{self.olympiad.id}/submit/',
            {'answers': {str(self.q1.id): answer}, 'time_taken': 30, 'tab_switches': 0},
            format='json',
        )

    def test_second_attempt_is_allowed_when_max_attempts_is_two(self):
        self._questions()
        self._submit("0")          # xato javob

        response = self._questions()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['attempt_number'], 2)
        self.assertEqual(response.data['attempts_left'], 0)

    def test_third_attempt_is_rejected(self):
        """Chegara haqiqatan ushlanadi."""
        self._questions()
        self._submit("0")
        self._questions()
        self._submit("1")

        response = self._questions()

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], 'error.already_submitted')

    def test_new_attempt_restarts_the_timer(self):
        """Ilgari started_at o'zgarmasdi, ya'ni 2-urinishga vaqt qolmasdi."""
        self._questions()
        attempt = TestResult.objects.get(user=self.student, olympiad=self.olympiad)
        attempt.started_at = timezone.now() - datetime.timedelta(minutes=50)
        attempt.save(update_fields=['started_at'])
        self._submit("0")

        self._questions()

        attempt.refresh_from_db()
        elapsed = (timezone.now() - attempt.started_at).total_seconds()
        self.assertLess(elapsed, 60)

    def test_previous_attempt_is_archived_not_destroyed(self):
        self._questions()
        self._submit("0")
        self._questions()
        self._submit("1")

        attempt = TestResult.objects.get(user=self.student, olympiad=self.olympiad)
        self.assertEqual(attempt.score, 1)                 # oxirgi urinish
        self.assertEqual(len(attempt.previous_attempts), 1)
        self.assertEqual(attempt.previous_attempts[0]['score'], 0)

    def test_xp_is_awarded_only_for_the_first_attempt(self):
        """Ilgari har topshirishda XP berilgani uchun cheksiz XP yig'ish mumkin edi."""
        self._questions()
        self._submit("1")
        self.student.refresh_from_db()
        xp_after_first = self.student.xp

        self._questions()
        self._submit("1")

        self.student.refresh_from_db()
        self.assertEqual(self.student.xp, xp_after_first)

    def test_submit_without_opening_a_new_attempt_is_rejected(self):
        """To'g'ridan-to'g'ri ikkinchi submit ishlamasligi kerak.

        Yangi urinish faqat `questions` orqali ochiladi — u taymerni ham
        qaytadan boshlaydi. Aks holda o'quvchi submit ni takrorlab,
        bir xil taymer ostida ballini yaxshilab olardi.
        """
        self._questions()
        self._submit("0")

        response = self._submit("1")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], 'error.already_submitted')


@override_settings(SECURE_SSL_REDIRECT=False)
class OlympiadExpiredAttemptTest(TestCase):
    """Vaqti tugagan urinish yangi taymer bermasligi kerak.

    Ilgari `OlympiadService.start_test` muddati o'tgan IN_PROGRESS yozuvni
    o'chirib, o'rniga toza urinish yaratardi. Ya'ni vaqti tugagan o'quvchi
    sahifani qayta yuklab, cheksiz marta to'liq yangi vaqt olib ketardi.
    """

    def setUp(self):
        self.student = User.objects.create_user(
            username='expired_student', password='x', role='STUDENT'
        )
        self.olympiad = Olympiad.objects.create(
            title="Muddat testi",
            start_date=timezone.now() - datetime.timedelta(hours=3),
            end_date=timezone.now() + datetime.timedelta(days=1),
            status='ONGOING',
            duration=30,
            max_attempts=1,
        )
        Question.objects.create(
            olympiad=self.olympiad, text="q", type='MCQ',
            options=["a", "b"], correct_answer="1", points=1, order=1,
        )
        OlympiadRegistration.objects.create(
            user=self.student, olympiad=self.olympiad, is_paid=True
        )

    def test_start_test_keeps_the_original_started_at(self):
        original = timezone.now() - datetime.timedelta(hours=2)
        TestResult.objects.create(
            user=self.student, olympiad=self.olympiad,
            status='IN_PROGRESS', started_at=original,
        )

        attempt = OlympiadService.start_test(self.student, self.olympiad.id)

        self.assertEqual(attempt.started_at, original)
        self.assertEqual(TestResult.objects.filter(user=self.student).count(), 1)


@override_settings(SECURE_SSL_REDIRECT=False)
class OlympiadScoringTest(TestCase):
    """Ball hisoblash ikkita yo'lda bir xil bo'lishi kerak."""

    def setUp(self):
        self.olympiad = Olympiad.objects.create(
            title="Baholash testi",
            start_date=timezone.now() - datetime.timedelta(minutes=5),
            end_date=timezone.now() + datetime.timedelta(days=1),
            status='ONGOING', duration=60,
        )

    def test_first_option_is_scored(self):
        """Ilgari `if not user_ans` sababli A varianti (indeks 0) hech
        qachon to'g'ri hisoblanmasdi — 0 Python'da False."""
        q = Question.objects.create(
            olympiad=self.olympiad, text="q", type='MCQ',
            options=["to'g'ri", "xato"], correct_answer="0", points=5, order=1,
        )

        score, total, pct = OlympiadService.score_answers(self.olympiad, {str(q.id): 0})

        self.assertEqual(score, 5)
        self.assertEqual(total, 5)
        self.assertEqual(pct, 100)

    def test_numeric_answer_tolerates_formatting(self):
        q = Question.objects.create(
            olympiad=self.olympiad, text="q", type='NUMERIC',
            correct_answer="5", points=2, order=1,
        )

        score, _, _ = OlympiadService.score_answers(self.olympiad, {str(q.id): "5.0"})

        self.assertEqual(score, 2)

    def test_text_answer_ignores_case_and_spacing(self):
        q = Question.objects.create(
            olympiad=self.olympiad, text="q", type='TEXT',
            correct_answer="Toshkent", points=3, order=1,
        )

        score, _, _ = OlympiadService.score_answers(self.olympiad, {str(q.id): "  toshkent "})

        self.assertEqual(score, 3)

    def test_text_questions_are_scored_by_finish_endpoint_too(self):
        """Ilgari `finish_test` faqat MCQ va NUMERIC ni baholardi, TEXT
        savollarining bali esa umumiy ballga qo'shilib yurardi — ya'ni
        hamma javobi to'g'ri o'quvchi ham 100% olmasdi."""
        student = User.objects.create_user(username='sc_student', password='x', role='STUDENT')
        q = Question.objects.create(
            olympiad=self.olympiad, text="q", type='TEXT',
            correct_answer="javob", points=4, order=1,
        )
        OlympiadRegistration.objects.create(user=student, olympiad=self.olympiad, is_paid=True)
        TestResult.objects.create(
            user=student, olympiad=self.olympiad, status='IN_PROGRESS',
            started_at=timezone.now(), answers={str(q.id): "javob"},
        )

        attempt = OlympiadService.finish_test(student, self.olympiad.id)

        self.assertEqual(attempt.score, 4)
        self.assertEqual(float(attempt.percentage), 100.0)


@override_settings(SECURE_SSL_REDIRECT=False)
class OlympiadRegistrationRulesTest(TestCase):
    """Ro'yxatdan o'tish qoidalari haqiqatan qo'llanishi kerak."""

    def setUp(self):
        self.client = APIClient()
        self.student = User.objects.create_user(
            username='reg_student', password='x', role='STUDENT', grade='8'
        )
        self.client.force_authenticate(user=self.student)

    def _make(self, **kwargs):
        defaults = dict(
            title="Ro'yxat testi",
            start_date=timezone.now() + datetime.timedelta(days=1),
            end_date=timezone.now() + datetime.timedelta(days=2),
            status='REGISTRATION_OPEN',
            duration=60,
        )
        defaults.update(kwargs)
        return Olympiad.objects.create(**defaults)

    def _register(self, olympiad):
        return self.client.post(f'/api/olympiads/{olympiad.id}/register/')

    def test_draft_olympiad_rejects_registration(self):
        """Ilgari faqat `status == 'COMPLETED'` qaralardi, u esa
        STATUS_CHOICES da yo'q edi — ya'ni shart hech qachon bajarilmasdi."""
        olympiad = self._make(status='DRAFT')

        response = self._register(olympiad)

        self.assertEqual(response.status_code, 400)
        self.assertFalse(OlympiadRegistration.objects.filter(olympiad=olympiad).exists())

    def test_registration_after_deadline_is_rejected(self):
        olympiad = self._make(
            registration_start=timezone.now() - datetime.timedelta(days=5),
            registration_end=timezone.now() - datetime.timedelta(days=1),
        )

        response = self._register(olympiad)

        self.assertEqual(response.status_code, 400)
        self.assertIn('muddati tugagan', response.data['error'])

    def test_registration_before_window_is_rejected(self):
        olympiad = self._make(
            registration_start=timezone.now() + datetime.timedelta(hours=5),
            registration_end=timezone.now() + datetime.timedelta(days=1),
        )

        response = self._register(olympiad)

        self.assertEqual(response.status_code, 400)

    def test_registration_inside_window_succeeds(self):
        olympiad = self._make(
            registration_start=timezone.now() - datetime.timedelta(hours=1),
            registration_end=timezone.now() + datetime.timedelta(hours=1),
        )

        response = self._register(olympiad)

        self.assertEqual(response.status_code, 201)

    def test_grade_outside_eligibility_is_rejected(self):
        """`eligibility_grades` modelda saqlanardi, lekin tekshirilmasdi."""
        olympiad = self._make(eligibility_grades=[5, 6])

        response = self._register(olympiad)

        self.assertEqual(response.status_code, 400)
        self.assertFalse(OlympiadRegistration.objects.filter(olympiad=olympiad).exists())

    def test_matching_grade_is_accepted(self):
        olympiad = self._make(eligibility_grades=[7, 8, 9])

        response = self._register(olympiad)

        self.assertEqual(response.status_code, 201)


@override_settings(SECURE_SSL_REDIRECT=False)
class OlympiadLeaderboardVisibilityTest(TestCase):
    """Imtihon davom etayotganda reyting ko'rinmasligi kerak.

    Ilgari `/result/` endpoint'i `is_results_open = True` dan boshlardi va
    faqat `result_time` ni qaralardi — u esa ko'pincha bo'sh. Natijada
    birinchi topshirgan o'quvchi davom etayotgan olimpiada reytingini
    ko'rib olardi.
    """

    def setUp(self):
        self.client = APIClient()
        self.student = User.objects.create_user(username='lb_student', password='x', role='STUDENT')
        self.rival = User.objects.create_user(username='lb_rival', password='x', role='STUDENT')
        self.olympiad = Olympiad.objects.create(
            title="Reyting testi",
            start_date=timezone.now() - datetime.timedelta(minutes=5),
            end_date=timezone.now() + datetime.timedelta(days=1),
            status='ONGOING', duration=60,
        )
        TestResult.objects.create(
            user=self.rival, olympiad=self.olympiad, score=10, percentage=100, status='COMPLETED'
        )
        TestResult.objects.create(
            user=self.student, olympiad=self.olympiad, score=5, percentage=50, status='COMPLETED'
        )
        self.client.force_authenticate(user=self.student)

    def test_leaderboard_hidden_while_olympiad_is_ongoing(self):
        response = self.client.get(f'/api/olympiads/{self.olympiad.id}/result/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'WAITING_RESULTS')
        self.assertNotIn('leaderboard', response.data)

    def test_leaderboard_visible_after_results_published(self):
        self.olympiad.status = 'PUBLISHED'
        self.olympiad.save(update_fields=['status'])

        response = self.client.get(f'/api/olympiads/{self.olympiad.id}/result/')

        self.assertEqual(response.data['status'], 'RESULTS_OPEN')
        self.assertEqual(len(response.data['leaderboard']), 2)


@override_settings(SECURE_SSL_REDIRECT=False)
class OlympiadStatusChoicesTest(TestCase):
    """Kodda ishlatiladigan har bir status STATUS_CHOICES da bo'lishi shart.

    Ilgari `UPCOMING` ro'yxatda yo'q edi, lekin `refresh_status()` uni
    bazaga yozardi va o'nlab so'rov shu bo'yicha filtrlardi.
    """

    def test_all_statuses_used_in_code_are_valid_choices(self):
        valid = {code for code, _ in Olympiad.STATUS_CHOICES}
        used = set(Olympiad.ACTIVE_STATUSES) | set(Olympiad.REGISTRABLE_STATUSES)
        used |= {'UPCOMING', 'COMPLETED', 'PAUSED', 'CANCELED', 'CHECKING'}

        self.assertEqual(used - valid, set())

    def test_refresh_status_does_not_activate_unapproved_olympiad(self):
        """Admin tasdig'ini kutayotgan (PENDING) olimpiada sana kelganda
        o'z-o'zidan ONGOING bo'lib ketmasligi kerak."""
        olympiad = Olympiad.objects.create(
            title="Moderatsiya testi",
            start_date=timezone.now() - datetime.timedelta(hours=1),
            end_date=timezone.now() + datetime.timedelta(hours=1),
            status='PENDING', duration=60,
        )

        self.assertEqual(olympiad.refresh_status(), 'PENDING')


@override_settings(SECURE_SSL_REDIRECT=False)
class LessonAccessTest(TestCase):
    """Kursga yozilgan o'quvchi darsni ocholishi kerak.

    Ilgari `LessonViewSet.get_queryset` admin bo'lmaganlarga
    `Lesson.objects.none()` qaytarardi, shuning uchun `GET /lessons/<id>/`
    doim 404 berardi — mobil ilovada "Dars topilmadi".
    """

    def setUp(self):
        self.client = APIClient()
        self.teacher = User.objects.create_user(username='la_teacher', password='x', role='TEACHER')
        self.student = User.objects.create_user(username='la_student', password='x', role='STUDENT')
        self.outsider = User.objects.create_user(username='la_outsider', password='x', role='STUDENT')
        self.course = Course.objects.create(title='Kurs', teacher=self.teacher, price=0)
        self.module = Module.objects.create(course=self.course, title='Modul', order=1)
        self.lesson = Lesson.objects.create(
            course=self.course, module=self.module, title='Dars', order=1
        )
        Enrollment.objects.create(user=self.student, course=self.course)

    def test_enrolled_student_can_open_lesson(self):
        self.client.force_authenticate(user=self.student)

        response = self.client.get(f'/api/lessons/{self.lesson.id}/')

        self.assertEqual(response.status_code, 200)

    def test_non_enrolled_student_cannot_open_paid_lesson(self):
        self.client.force_authenticate(user=self.outsider)

        response = self.client.get(f'/api/lessons/{self.lesson.id}/')

        self.assertEqual(response.status_code, 404)

    def test_free_lesson_is_open_to_everyone(self):
        free = Lesson.objects.create(
            course=self.course, module=self.module, title='Bepul', order=2, is_free=True
        )
        self.client.force_authenticate(user=self.outsider)

        response = self.client.get(f'/api/lessons/{free.id}/')

        self.assertEqual(response.status_code, 200)

    def test_student_cannot_create_a_lesson_test(self):
        """Ilgari HasCourseAccess da `has_permission` yo'q edi, shuning
        uchun o'quvchi istalgan darsga test qo'shib yuborishi mumkin edi."""
        self.client.force_authenticate(user=self.student)

        response = self.client.post(
            '/api/lesson-tests/',
            {'lesson': self.lesson.id, 'min_pass_score': 0},
            format='json',
        )

        self.assertIn(response.status_code, (403, 404))
        self.assertEqual(LessonTest.objects.count(), 0)


@override_settings(SECURE_SSL_REDIRECT=False)
class CourseProgressTest(TestCase):
    """Oxirgi darsni tugatgan o'quvchi 100% ga yetishi kerak.

    Ilgari `progress.save()` `_check_and_finalize_lesson` dan KEYIN
    chaqirilardi. Ichkaridagi `update_enrollment_stats` esa tugallangan
    darslarni bazadan sanaydi, shuning uchun joriy dars hisobga tushmasdi:
    progress doim bitta darsga orqada qolardi.
    """

    def setUp(self):
        self.teacher = User.objects.create_user(username='cp_teacher', password='x', role='TEACHER')
        self.student = User.objects.create_user(username='cp_student', password='x', role='STUDENT')
        self.course = Course.objects.create(
            title='Kurs', teacher=self.teacher, price=0, is_certificate_enabled=False
        )
        self.module = Module.objects.create(course=self.course, title='Modul', order=1)
        self.lesson = Lesson.objects.create(
            course=self.course, module=self.module, title='Yakka dars', order=1
        )
        Enrollment.objects.create(user=self.student, course=self.course)

    def test_single_lesson_course_reaches_full_progress(self):
        LearningService.update_lesson_progress(
            self.student, self.lesson.id, 'VIDEO_COMPLETE', {'position': 100}
        )

        enrollment = Enrollment.objects.get(user=self.student, course=self.course)
        self.assertEqual(float(enrollment.progress), 100.0)
        self.assertIsNotNone(enrollment.completed_at)


@override_settings(SECURE_SSL_REDIRECT=False)
class LessonTestAttemptsTest(TestCase):
    """`LessonTest.max_attempts` haqiqatan cheklashi kerak."""

    def setUp(self):
        self.teacher = User.objects.create_user(username='lt_teacher', password='x', role='TEACHER')
        self.student = User.objects.create_user(username='lt_student', password='x', role='STUDENT')
        self.course = Course.objects.create(title='Kurs', teacher=self.teacher, price=0)
        self.module = Module.objects.create(course=self.course, title='Modul', order=1)
        self.lesson = Lesson.objects.create(
            course=self.course, module=self.module, title='Dars', order=1
        )
        Enrollment.objects.create(user=self.student, course=self.course)
        self.test = LessonTest.objects.create(
            lesson=self.lesson, min_pass_score=50, max_attempts=2
        )
        self.q = Question.objects.create(
            text='q', type='MCQ', options=['a', 'b'], correct_answer='1', points=10, order=1
        )
        self.test.questions.add(self.q)

    def _submit(self, answer):
        return LearningService.update_lesson_progress(
            self.student, self.lesson.id, 'SUBMIT_TEST',
            {'answers': {str(self.q.id): answer}},
        )

    def test_attempts_beyond_the_limit_are_rejected(self):
        from rest_framework.exceptions import ValidationError

        self._submit('0')
        self._submit('0')

        with self.assertRaises(ValidationError):
            self._submit('1')

    def test_best_score_is_kept_across_attempts(self):
        """Ilgari oxirgi urinish yozilardi: 100% olgan o'quvchi qayta
        topshirib 0% olsa, bali tushib ketardi."""
        self._submit('1')          # 100%
        self._submit('0')          # 0%

        progress = LessonProgress.objects.get(user=self.student, lesson=self.lesson)
        self.assertEqual(progress.test_score, 100)
        self.assertEqual(progress.test_attempts, 2)

    def test_question_points_are_respected(self):
        """Ilgari har bir savol 1 ball deb sanalardi, `points` e'tiborsiz edi."""
        heavy = Question.objects.create(
            text='q2', type='MCQ', options=['a', 'b'], correct_answer='1', points=90, order=2
        )
        self.test.questions.add(heavy)

        LearningService.update_lesson_progress(
            self.student, self.lesson.id, 'SUBMIT_TEST',
            {'answers': {str(heavy.id): '1'}},     # 90 / 100 ball
        )

        progress = LessonProgress.objects.get(user=self.student, lesson=self.lesson)
        self.assertEqual(progress.test_score, 90)


@override_settings(SECURE_SSL_REDIRECT=False)
class ModuleRewardTest(TestCase):
    """Modul mukofoti ID prefiksi tufayli yo'qolmasligi kerak.

    Ilgari marker `description__contains="Module ID: 1"` orqali
    izlanardi, u esa "Module ID: 12" ga ham mos keladi — ya'ni 12-modul
    mukofotlangandan keyin 1-modul uchun XP berilmay qolardi.
    """

    def test_module_1_is_rewarded_after_module_12(self):
        teacher = User.objects.create_user(username='mr_teacher', password='x', role='TEACHER')
        student = User.objects.create_user(username='mr_student', password='x', role='STUDENT')
        course = Course.objects.create(title='Kurs', teacher=teacher, price=0)

        modules = {}
        for order in (1, 12):
            module = Module.objects.create(
                course=course, title=f'Modul {order}', order=order, xp_reward=25
            )
            lesson = Lesson.objects.create(
                course=course, module=module, title=f'Dars {order}', order=order
            )
            LessonProgress.objects.create(
                user=student, lesson=lesson, is_completed=True, is_video_watched=True
            )
            modules[order] = module

        LearningService.check_module_completion(student, modules[12])
        student.refresh_from_db()
        xp_after_12 = student.xp

        LearningService.check_module_completion(student, modules[1])

        student.refresh_from_db()
        self.assertEqual(student.xp, xp_after_12 + 25)


@override_settings(SECURE_SSL_REDIRECT=False)
class CourseBuyTest(TestCase):
    """Balans bilan kurs sotib olish ishlashi kerak.

    Ilgari `Payment.objects.create(..., payment_method='BALANCE')` deb
    yozilgan edi. Bu maydon Payment da emas, Payout da — shuning uchun
    chaqiruv TypeError bergan: balans YECHILGANDAN KEYIN so'rov 500 bilan
    tushib, pul qaytmay qolardi.
    """

    def setUp(self):
        self.client = APIClient()
        self.teacher = User.objects.create_user(username='cb_teacher', password='x', role='TEACHER')
        self.student = User.objects.create_user(
            username='cb_student', password='x', role='STUDENT', balance=Decimal('100000')
        )
        self.course = Course.objects.create(
            title='Pullik kurs', teacher=self.teacher, price=Decimal('50000')
        )
        self.client.force_authenticate(user=self.student)

    def test_buy_succeeds_and_enrolls(self):
        response = self.client.post(f'/api/courses/{self.course.id}/buy/')

        self.assertEqual(response.status_code, 200, response.data)
        self.student.refresh_from_db()
        self.assertEqual(self.student.balance, Decimal('50000'))
        self.assertTrue(Enrollment.objects.filter(user=self.student, course=self.course).exists())
        self.assertTrue(
            Payment.objects.filter(user=self.student, status='COMPLETED', method='BALANCE').exists()
        )

    def test_buy_without_enough_balance_does_not_charge(self):
        self.course.price = Decimal('500000')
        self.course.save(update_fields=['price'])

        response = self.client.post(f'/api/courses/{self.course.id}/buy/')

        self.assertEqual(response.status_code, 402)
        self.student.refresh_from_db()
        self.assertEqual(self.student.balance, Decimal('100000'))

    def test_free_enrollment_increments_students_count(self):
        """Ilgari son faqat `buy` ichida oshardi, bepul kurslarda 0 turardi."""
        free = Course.objects.create(title='Bepul', teacher=self.teacher, price=0)

        self.client.post(f'/api/courses/{free.id}/enroll/')

        free.refresh_from_db()
        self.assertEqual(free.students_count, 1)


@override_settings(SECURE_SSL_REDIRECT=False, PENDING_BALANCE_DAYS=7)
class PendingBalanceReleaseTest(TestCase):
    """Pending balans bir marta ochilishi kerak, qayta-qayta emas.

    Ilgari "allaqachon o'tkazilgan" belgisi yo'q edi, shuning uchun har
    chaqiruvda bir xil eski tranzaksiyalar qayta ko'rilardi va yangi,
    hali muddati yetmagan pul muddatidan oldin ochilib ketardi.
    """

    def setUp(self):
        from api.models import TeacherWallet, Transaction

        self.teacher = User.objects.create_user(username='pb_teacher', password='x', role='TEACHER')
        self.course = Course.objects.create(title='Kurs', teacher=self.teacher, price=Decimal('100000'))
        self.wallet = TeacherWallet.objects.create(
            teacher=self.teacher, pending_balance=Decimal('70000')
        )
        self.old_trans = Transaction.objects.create(
            transaction_type='COURSE_SALE', user=self.teacher, course=self.course,
            amount=Decimal('100000'), teacher_earnings=Decimal('70000'),
            platform_commission=Decimal('30000'), status='SUCCESS',
        )
        # 10 kun oldin sotilgan deb belgilaymiz (auto_now_add ni chetlab o'tamiz)
        Transaction.objects.filter(pk=self.old_trans.pk).update(
            created_at=timezone.now() - datetime.timedelta(days=10)
        )

    def test_release_moves_teacher_share_once(self):
        from api.services.wallet_service import WalletService

        released = WalletService.release_pending_balance()

        self.wallet.refresh_from_db()
        self.assertEqual(released, 1)
        self.assertEqual(self.wallet.pending_balance, Decimal('0'))
        self.assertEqual(self.wallet.balance, Decimal('70000'))

    def test_second_run_does_not_release_fresh_money(self):
        from api.models import Transaction
        from api.services.wallet_service import WalletService

        WalletService.release_pending_balance()

        # Bugun yangi sotuv bo'ldi — u hali 7 kun ushlab turilishi kerak.
        Transaction.objects.create(
            transaction_type='COURSE_SALE', user=self.teacher, course=self.course,
            amount=Decimal('100000'), teacher_earnings=Decimal('70000'),
            status='SUCCESS',
        )
        self.wallet.refresh_from_db()
        self.wallet.pending_balance = Decimal('70000')
        self.wallet.save(update_fields=['pending_balance'])

        released = WalletService.release_pending_balance()

        self.wallet.refresh_from_db()
        self.assertEqual(released, 0)
        self.assertEqual(self.wallet.pending_balance, Decimal('70000'))


@override_settings(SECURE_SSL_REDIRECT=False)
class CertificateIssuanceTest(TestCase):
    """Sertifikat raqami va yaratish sharti."""

    def setUp(self):
        self.teacher = User.objects.create_user(username='ci_teacher', password='x', role='TEACHER')
        self.student = User.objects.create_user(username='ci_student', password='x', role='STUDENT')

    def _finish_course(self, certificate_enabled):
        course = Course.objects.create(
            title='Kurs', teacher=self.teacher, price=0,
            is_certificate_enabled=certificate_enabled,
        )
        module = Module.objects.create(course=course, title='Modul', order=1)
        lesson = Lesson.objects.create(course=course, module=module, title='Dars', order=1)
        Enrollment.objects.create(user=self.student, course=course)
        LearningService.update_lesson_progress(
            self.student, lesson.id, 'VIDEO_COMPLETE', {'position': 10}
        )
        return course

    def test_certificate_is_issued_when_enabled(self):
        from api.models import Certificate

        course = self._finish_course(True)

        self.assertEqual(Certificate.objects.filter(user=self.student, course=course).count(), 1)

    def test_no_certificate_when_disabled(self):
        """Ilgari signal `is_certificate_enabled` ni tekshirmagani uchun
        o'chirilgan kursda ham sertifikat yaratilardi."""
        from api.models import Certificate

        course = self._finish_course(False)

        self.assertFalse(Certificate.objects.filter(user=self.student, course=course).exists())

    def test_cert_numbers_stay_unique_at_scale(self):
        """Ilgari raqam CRT-1000..9999 oralig'idan olinardi: 9000 tadan
        keyin `while True` bo'sh raqam topmay abadiy aylanib qolardi."""
        from api.models import Certificate

        numbers = set()
        for index in range(60):
            cert = Certificate.objects.create(
                user=self.student, grade='100%', score=100, cert_type='DIPLOMA'
            )
            numbers.add(cert.cert_number)

        self.assertEqual(len(numbers), 60)
        self.assertTrue(all(len(n) <= 32 for n in numbers))


@override_settings(SECURE_SSL_REDIRECT=False)
class RewardDistributionTest(TestCase):
    """Sovrin tarqatish bir marta bo'lishi va darajani yangilashi kerak."""

    def setUp(self):
        from api.models import OlympiadPrize

        self.student = User.objects.create_user(
            username='rw_student', password='x', role='STUDENT', balance=Decimal('0')
        )
        self.olympiad = Olympiad.objects.create(
            title='Sovrin testi',
            start_date=timezone.now() - datetime.timedelta(days=2),
            end_date=timezone.now() - datetime.timedelta(days=1),
            status='CHECKING', duration=60,
            reward_strategy='TOP_N',
        )
        q = Question.objects.create(
            olympiad=self.olympiad, text='q', type='MCQ',
            options=['a', 'b'], correct_answer='1', points=10, order=1,
        )
        TestResult.objects.create(
            user=self.student, olympiad=self.olympiad, score=10, percentage=100,
            status='COMPLETED', answers={str(q.id): '1'},
        )
        self.coin_prize = OlympiadPrize.objects.create(
            olympiad=self.olympiad, name='1-o\'rin coin', prize_type='COIN',
            amount=Decimal('50000'), target_value=1,
        )
        self.xp_prize = OlympiadPrize.objects.create(
            olympiad=self.olympiad, name='1-o\'rin XP', prize_type='XP',
            amount=Decimal('1500'), target_value=1,
        )

    def test_rewards_are_distributed_once(self):
        """Ilgari coin va XP idempotent emasdi: xatodan keyin qayta
        chaqirilganda ikki marta berilardi."""
        from api.services.reward_service import RewardService

        RewardService.distribute_rewards(self.olympiad.id)

        # Statusni 'FAILED' qilib, qayta chaqiramiz — xatodan keyingi holat.
        Olympiad.objects.filter(pk=self.olympiad.pk).update(
            reward_distribution_status='FAILED'
        )
        RewardService.distribute_rewards(self.olympiad.id)

        self.student.refresh_from_db()
        self.assertEqual(self.student.balance, Decimal('50000'))
        self.assertEqual(self.student.xp, 1500)

    def test_xp_reward_updates_the_level(self):
        """Ilgari `user.xp += amount; user.save()` ishlatilgani uchun
        daraja qayta hisoblanmasdi."""
        from api.services.reward_service import RewardService

        RewardService.distribute_rewards(self.olympiad.id)

        self.student.refresh_from_db()
        self.assertEqual(self.student.xp, 1500)
        self.assertEqual(self.student.level, 4)   # 500 XP = 1 daraja
