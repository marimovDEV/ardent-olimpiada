from django.utils import timezone
from api.models import (
    Course, Module, Lesson, LessonProgress, 
    Enrollment, LessonPractice, LessonTest, User,
    Certificate
)
from api.utils import generate_unique_id
from rest_framework.exceptions import ValidationError
from django.db.models import Prefetch

class LearningService:
    @staticmethod
    def get_course_learning_state(user, course_id):
        """
        Calculates the complete learning state for a user in a course,
        including which lessons are locked and their progress.
        """
        try:
            enrollment = Enrollment.objects.get(user=user, course_id=course_id)
        except Enrollment.DoesNotExist:
            # Guest/Preview Mode
            course = Course.objects.get(id=course_id)
            # Create a temporary unsaved enrollment object for frontend compatibility
            enrollment = Enrollment(
                user=user, 
                course=course, 
                progress=0,
                created_at=timezone.now(),
                updated_at=timezone.now()
            )
            
        # Prefetch lessons with their progress for this specific user
        progress_prefetch = Prefetch(
            'lessons__user_progress',
            queryset=LessonProgress.objects.filter(user=user),
            to_attr='my_progress'
        )

        modules = Module.objects.filter(course_id=course_id).prefetch_related(
            progress_prefetch
        ).order_by('order')

        # To handle locking: a lesson is locked if the previous lesson is not completed.
        # First lesson of the first module is always unlocked.
        
        flat_lessons = []
        for m in modules:
            for l in m.lessons.all():
                # Attach module info for convenience
                l.module_title = m.title
                
                # Get user progress for this lesson
                progress = getattr(l, 'my_progress', [])
                l.progress_data = progress[0] if progress else None
                flat_lessons.append(l)

        # Iterate and set is_locked
        previous_completed = True # First lesson is unlocked IF enrolled
        
        # If not enrolled (id is None), base locking purely on is_free
        is_enrolled = enrollment.id is not None
        
        for i, lesson in enumerate(flat_lessons):
            if not is_enrolled:
                # Guest mode: Lock everything except free lessons
                lesson.is_locked = not lesson.is_free
            else:
                # Enrolled mode: standard progressive locking
                lesson.is_locked = not previous_completed
                
                # Free lessons are always unlocked?
                if lesson.is_free:
                    lesson.is_locked = False

                # Update previous_completed for NEXT iteration
                is_completed = lesson.progress_data.is_completed if lesson.progress_data else False
                previous_completed = is_completed

        return {
            "enrollment": enrollment,
            "modules": modules,
            "flat_lessons": flat_lessons
        }

    @staticmethod
    def set_current_lesson(user, course_id, lesson_id):
        """Update the current lesson for an enrollment"""
        try:
            enrollment = Enrollment.objects.get(user=user, course_id=course_id)
            lesson = Lesson.objects.get(id=lesson_id, course_id=course_id)
            enrollment.current_lesson = lesson
            enrollment.save(update_fields=['current_lesson'])
            return enrollment
        except (Enrollment.DoesNotExist, Lesson.DoesNotExist):
            return None

    @staticmethod
    def update_lesson_progress(user, lesson_id, update_type, data=None):
        """
        Updates specific parts of lesson progress (video, practice, test).
        """
        lesson = Lesson.objects.get(id=lesson_id)
        
        # Check enrollment
        if not Enrollment.objects.filter(user=user, course=lesson.course).exists():
            raise ValidationError("Not enrolled")

        progress, created = LessonProgress.objects.get_or_create(
            user=user,
            lesson=lesson
        )

        if update_type == 'VIDEO_COMPLETE':
            progress.is_video_watched = True
            progress.video_last_position = data.get('position', 0) if data else 0
        
        elif update_type == 'SUBMIT_PRACTICE':
            # Handle practice logic
            try:
                practice = lesson.practice
                user_answer = data.get('answer', '')
                progress.practice_submission = user_answer
                
                # Simple auto-check for now if correct_answer is provided
                if practice.correct_answer and user_answer.strip().lower() == practice.correct_answer.strip().lower():
                    progress.practice_score = practice.points
                else:
                    # If no correct_answer or mismatch, maybe it needs teacher review?
                    # For now, mark as 0 or pending.
                    progress.practice_score = 0
            except LessonPractice.DoesNotExist:
                pass

        elif update_type == 'SUBMIT_TEST':
            # Handle test grading (similar to OlympiadService)
            try:
                test = lesson.test
                answers = data.get('answers', {}) # {question_id: value}
                score = 0
                total_q = test.questions.count()
                
                for q in test.questions.all():
                    user_val = answers.get(str(q.id))
                    if str(user_val) == str(q.correct_answer):
                        score += 1
                
                percentage = (score / total_q * 100) if total_q > 0 else 0
                progress.test_score = int(percentage)
                progress.test_attempts += 1
            except LessonTest.DoesNotExist:
                pass

        # Check if lesson is now fully complete
        LearningService._check_and_finalize_lesson(user, lesson, progress)
        
        progress.save()
        return progress

    @staticmethod
    def _check_and_finalize_lesson(user, lesson, progress):
        """
        Internal logic to determine if a lesson is finished.
        Rule: Video must be watched. If Practice exists, must be attempted (or passed).
        If Test exists, must pass min_pass_score.
        """
        has_practice = hasattr(lesson, 'practice')
        has_test = hasattr(lesson, 'test')
        
        video_done = progress.is_video_watched
        practice_done = True if not has_practice else (progress.practice_score is not None)
        test_done = True
        
        if has_test:
            test = lesson.test
            # Score must exist and be >= min_pass_score
            test_done = (progress.test_score is not None and progress.test_score >= test.min_pass_score)
        
        if video_done and practice_done and test_done:
            if not progress.is_completed:
                progress.is_completed = True
                progress.completed_at = timezone.now()
                
                # Update Streak
                from api.streak_service import StreakService
                StreakService.record_activity(user, 'LESSON_COMPLETE', f"Completed lesson: {lesson.title}")
                
                # Reward Lesson XP
                if lesson.xp_amount > 0:
                    user.add_xp(lesson.xp_amount, 'LESSON_COMPLETE', f"Dars yakunlandi: {lesson.title}")
                
                # Update Enrollment overall progress
                LearningService.update_enrollment_stats(user, lesson.course)

    @staticmethod
    def update_enrollment_stats(user, course):
        """Recalculate total course progress % for an enrollment"""
        total_lessons = Lesson.objects.filter(course=course, is_published=True).count()
        completed_lessons = LessonProgress.objects.filter(
            user=user, 
            lesson__course=course, 
            is_completed=True
        ).count()
        
        progress_pct = (completed_lessons / total_lessons * 100) if total_lessons > 0 else 0
        
        enrollment = Enrollment.objects.get(user=user, course=course)
        enrollment.progress = progress_pct
        
        if progress_pct >= 100 and not enrollment.completed_at:
            enrollment.completed_at = timezone.now()
            # Reward XP for course completion
            user.add_xp(course.xp_reward, 'COURSE_ENROLL', f"Kurs yakunlandi: {course.title}")
            
            # Create certificate if not already exists AND it's enabled for course
            if course.is_certificate_enabled and not Certificate.objects.filter(user=user, course=course).exists():
                cert_number = generate_unique_id('CRT')
                Certificate.objects.create(
                    cert_number=cert_number,
                    user=user,
                    course=course,
                    grade='100%',
                    status='PENDING' # Or APPROVED depending on business rule
                )
            
            # Send notification to student
            Notification.objects.create(
                user=user,
                title="Tabriklaymiz! 🎓",
                message=f"Siz '{course.title}' kursini muvaffaqiyatli yakunladingiz! Bilimlaringizni amalda qo'llashda omad tilaymiz.",
                notification_type='ACHIEVEMENT',
                channel='ALL',
                link=f"/course/{course.id}"
            )
            
        enrollment.save()
