from django.utils import timezone
from api.models import Olympiad, OlympiadRegistration, TestResult, Question, User

from django.db import transaction
from rest_framework.exceptions import ValidationError

class OlympiadService:
    
    @staticmethod
    def register_user(user, olympiad):
        """Register user for olympiad (handle payment & limits)"""
        if OlympiadRegistration.objects.filter(user=user, olympiad=olympiad).exists():
            raise ValidationError("error.already_registered")
            
        if olympiad.max_participants and olympiad.participants_count >= olympiad.max_participants:
            raise ValidationError("error.full")
            
        if olympiad.price > 0:
            if user.balance < olympiad.price:
                raise ValidationError("error.insufficient_balance")
            # Ilgari bu yerda `pass` turardi: balans tekshirilib, lekin
            # hech qachon yechilmasdi — ya'ni pullik olimpiada bepul edi.
            user.balance -= olympiad.price
            user.save(update_fields=['balance'])

        registration = OlympiadRegistration.objects.create(
            user=user, 
            olympiad=olympiad,
            is_paid=True
        )
        
        # Telegram Notification
        if user.telegram_id:
            from api.telegram_service import TelegramService
            msg = (
                f"✅ <b>Muvaffaqiyatli ro'yxatdan o'tdingiz!</b>\n\n"
                f"🏆 Olimpiada: {olympiad.title}\n"
                f"📅 Boshlanish vaqti: {olympiad.start_date.strftime('%Y-%m-%d %H:%M')}\n\n"
                f"Olimpiada boshlanishidan 1 soat oldin eslatma yuboramiz."
            )
            TelegramService.send_message(str(user.telegram_id), msg)
            
        return registration

    @staticmethod
    def start_test(user, olympiad_id):
        """Start the test attempt"""
        olympiad = Olympiad.objects.get(id=olympiad_id)
        
        # Check active window (skip if admin set status to ONGOING manually)
        now = timezone.now()
        if olympiad.status != 'ONGOING':
            if now < olympiad.start_date:
                raise ValidationError("error.not_started")
            if olympiad.end_date and now > olympiad.end_date:
                raise ValidationError("error.finished")
            
        # Check registration
        if not OlympiadRegistration.objects.filter(user=user, olympiad=olympiad).exists():
            raise ValidationError("error.not_registered")
            
        # Check existing attempt
        attempt = TestResult.objects.filter(user=user, olympiad=olympiad).first()

        if attempt is None:
            return TestResult.objects.create(
                user=user, olympiad=olympiad, status='IN_PROGRESS',
                started_at=timezone.now(),
            )

        if attempt.status in ('COMPLETED', 'DISQUALIFIED', 'CHECKING'):
            # Qayta urinish faqat max_attempts ruxsat bergancha. Hisoblagich
            # TestResult.attempt_number da yuritiladi — ilgari urinish
            # o'chirib tashlanardi, shuning uchun na chegara ishlardi,
            # na oldingi natija saqlanardi.
            if not attempt.can_retake():
                raise ValidationError("error.already_submitted")
            return attempt.open_new_attempt()

        # IN_PROGRESS: taymer tugab qolgan bo'lsa ham urinishni YANGILAMAYMIZ.
        # Ilgari bu yerda muddati o'tgan urinish o'chirilib, o'rniga toza
        # urinish ochilardi — ya'ni vaqti tugagan o'quvchi sahifani qayta
        # yuklab, cheksiz marta to'liq yangi vaqt olib ketardi.
        # started_at o'zgarmasin: muddatdan oshgani `submit` da aniqlanadi.
        if attempt.started_at is None:
            attempt.started_at = attempt.submitted_at or timezone.now()
            attempt.save(update_fields=['started_at'])

        return attempt

    @staticmethod
    def is_answer_correct(question, user_answer):
        """Bitta javobni tekshiradi.

        Diqqat: `if not user_answer` ishlatmaymiz. MCQ javobi variant
        INDEKSI, ya'ni birinchi variant (A) — 0. Python'da `not 0` True,
        shuning uchun eski kod A variantini hech qachon to'g'ri deb
        hisoblamasdi. Faqat haqiqatan bo'sh javobni tashlab ketamiz.
        """
        if user_answer is None:
            return False
        given = str(user_answer).strip()
        if given == '':
            return False

        expected = str(question.correct_answer or '').strip()
        if expected == '':
            # To'g'ri javob kiritilmagan savol (masalan qo'lda tekshiriladigan
            # CODE) avtomatik ball bermaydi.
            return False

        if question.type == 'NUMERIC':
            # "5" va "5.0" bir xil son. Vergulni ham nuqta deb qabul qilamiz.
            try:
                return float(given.replace(',', '.')) == float(expected.replace(',', '.'))
            except ValueError:
                return given == expected

        if question.type == 'TEXT':
            # Matnli javobda katta-kichik harf va ortiqcha bo'shliq muhim emas.
            return ' '.join(given.lower().split()) == ' '.join(expected.lower().split())

        # MCQ va CODE — aynan mos kelishi kerak.
        return given == expected

    @staticmethod
    def score_answers(olympiad, answers):
        """Javoblar to'plamini baholaydi -> (score, total_points, percentage).

        `submit` va `finish_test` ikkisi ham SHU funksiyadan foydalanadi.
        Ilgari har biri o'zicha hisoblardi va natijalar bir-biriga mos
        kelmasdi: `finish_test` TEXT va CODE savollarini umuman
        baholamagan holda ularning ballini umumiy ballga qo'shib yurardi.
        """
        answers = answers or {}
        score = 0
        total_points = 0

        for question in olympiad.questions.all():
            total_points += question.points
            if OlympiadService.is_answer_correct(question, answers.get(str(question.id))):
                score += question.points

        percentage = round((score / total_points * 100), 2) if total_points > 0 else 0
        return score, total_points, percentage

    @staticmethod
    def submit_answer(user, olympiad_id, question_id, answer_value):
        """Submit single answer (incremental save)"""
        attempt = TestResult.objects.get(user=user, olympiad_id=olympiad_id)
        
        if attempt.status == 'COMPLETED':
            raise ValidationError("error.already_submitted")
            
        attempt.answers[str(question_id)] = answer_value
        attempt.save()
        return attempt

    @staticmethod
    def finish_test(user, olympiad_id, reason="manual"):
        """Finish test and calculate score"""
        attempt = TestResult.objects.get(user=user, olympiad_id=olympiad_id)
        
        if attempt.status in ('COMPLETED', 'DISQUALIFIED', 'CHECKING'):
            return attempt

        olympiad = attempt.olympiad
        score, total_points, percentage = OlympiadService.score_answers(olympiad, attempt.answers)

        attempt.score = score
        attempt.percentage = percentage
        # Boshlanish vaqti — `started_at`. `submitted_at` auto_now_add bo'lgani
        # uchun u yozuv YARATILGAN paytni ko'rsatadi; bundan tashqari eski kod
        # `.seconds` ishlatardi, u esa 24 soatdan oshgan farqdan kunlarni
        # tashlab yuboradi (masalan 25 soat -> 1 soat).
        reference = attempt.started_at or attempt.submitted_at
        attempt.time_taken = int((timezone.now() - reference).total_seconds()) if reference else 0
        attempt.status = 'COMPLETED'
        attempt.save()

        # XP faqat birinchi tugallangan urinishga. Qayta topshirish XP bermaydi.
        if olympiad.xp_reward > 0 and not attempt.previous_attempts:
            user.add_xp(olympiad.xp_reward, 'OLYMPIAD_PARTICIPATION', f"Olimpiada yakunlandi: {olympiad.title}")
        
        # Bonus XP for high performance (optional, keeping it as 2x score if preferred, 
        # but user asked for 150 fixed for participation. Let's stick to user's 150)
        # user.add_xp(int(score) * 2, ...)  # Removed this to strictly follow requested values
        
        # Record Streak Activity
        from api.streak_service import StreakService
        StreakService.record_activity(user, 'OLYMPIAD_PARTICIPATION', f"Olimpiada topshirildi: {olympiad.title}")

        # Update Career Progress
        from api.services.profession_service import ProfessionService
        ProfessionService.update_all_active_professions(user)

        # 🚀 HOGWORDS CAREER ENGINE HOOK: Auto-complete Olympiad Nodes
        try:
            from api.models import ProfessionNode, UserProfessionState
            from api.services.career_engine_service import CareerEngineService
            
            # Get all active profession states for the user
            active_states = UserProfessionState.objects.filter(user=user, status='active')
            for state in active_states:
                if state.current_level:
                    # Find if there's an olympiad node in the current level for this olympiad
                    nodes = state.current_level.nodes.filter(
                        node_type='olympiad', 
                        reference_id=olympiad.id
                    )
                    for node in nodes:
                        try:
                            # Pass the actual score percentage achieved as the node score
                            CareerEngineService.complete_node(user, node, score=int(percentage))
                        except Exception as e:
                            print(f"CareerEngine Error completing olympiad node: {e}")
        except Exception as e:
            print(f"CareerEngine Error: {e}")

        # Telegram Notification
        if user.telegram_id:
            from api.telegram_service import TelegramService
            msg = (
                f"🏁 <b>{olympiad.title} yakunlandi!</b>\n\n"
                f"📊 Natijangiz: {score} ball ({percentage:.1f}%)\n"
                f"⏱ Vaqt: {attempt.time_taken // 60} daqiqa\n\n"
                f"Batafsil tahlilni saytda ko'rishingiz mumkin."
            )
            TelegramService.send_message(str(user.telegram_id), msg)

        return attempt

    @staticmethod
    def notify_participants_olympiad_start(olympiad):
        """Notify all registered participants that the olympiad has started"""
        from api.bot_service import BotService
        
        registrations = OlympiadRegistration.objects.filter(olympiad=olympiad)
        count = 0
        for reg in registrations:
            if reg.user.telegram_id:
                if BotService.notify_olympiad(reg.user, olympiad, message_type="start"):
                    count += 1
        return count

    @staticmethod
    def publish_results(olympiad_id):
        """
        Publish results and distribute rewards if auto_reward is enabled.
        """
        from api.services.reward_service import RewardService
        
        olympiad = Olympiad.objects.get(id=olympiad_id)
        olympiad.status = 'PUBLISHED'
        olympiad.result_time = timezone.now()
        olympiad.save()
        
        if olympiad.auto_reward:
            # Trigger reward distribution
            RewardService.distribute_rewards(olympiad.id)
            
        return olympiad
