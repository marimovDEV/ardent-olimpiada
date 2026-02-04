from django.test import TestCase
from django.utils import timezone
from api.models import User, Olympiad, TestResult
from rest_framework.test import APIClient
import datetime

class OlympiadVisibilityTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='student', password='testpassword', role='STUDENT')
        self.teacher = User.objects.create_user(username='teacher', password='testpassword', role='TEACHER')
        self.olympiad = Olympiad.objects.create(
            title="Test Olympiad",
            subject="Math",
            start_date=timezone.now(),
            end_date=timezone.now() + datetime.timedelta(days=1),
            status='ONGOING',
            teacher=self.teacher,
            duration=60
        )
        # Create a result
        self.result = TestResult.objects.create(
            user=self.user,
            olympiad=self.olympiad,
            score=90,
            status='COMPLETED'
        )

    def test_leaderboard_locked_when_ongoing(self):
        """Leaderboard should be empty when status is ONGOING for student"""
        response = self.client.get(f'/api/olympiads/{self.olympiad.id}/leaderboard/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'ONGOING')
        self.assertEqual(len(response.data['leaderboard']), 0)

    def test_leaderboard_visible_when_published(self):
        """Leaderboard should be visible when status is PUBLISHED"""
        self.olympiad.status = 'PUBLISHED'
        self.olympiad.save()
        
        response = self.client.get(f'/api/olympiads/{self.olympiad.id}/leaderboard/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'PUBLISHED')
        self.assertGreater(len(response.data['leaderboard']), 0)
        self.assertEqual(response.data['leaderboard'][0]['student'], 'student')

    def test_teacher_can_see_leaderboard_anytime(self):
        """Teacher should see leaderboard even if not published"""
        self.client.force_authenticate(user=self.teacher)
        response = self.client.get(f'/api/olympiads/{self.olympiad.id}/leaderboard/')
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.data['leaderboard']), 0)
