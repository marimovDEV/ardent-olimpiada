from django.db import models, transaction
from django.utils import timezone
from decimal import Decimal
import logging

from ..models import (
    Olympiad, 
    TestResult, 
    OlympiadPrize, 
    WinnerPrize, 
    Transaction, 
    User,
    PrizeAddress
)
from ..bot_service import BotService

logger = logging.getLogger(__name__)

class RewardService:
    """
    Service for automated Olympiad ranking calculation and reward distribution.
    """

    @staticmethod
    def calculate_rankings(olympiad):
        """
        Sort participants by score (desc) and time taken (asc).
        Returns list of (User, TestResult, position)
        """
        # Get only completed results that are not disqualified
        results = TestResult.objects.filter(
            olympiad=olympiad,
            status='COMPLETED'
        ).select_related('user').order_by('-score', 'time_taken')

        rankings = []
        for i, result in enumerate(results):
            rankings.append({
                'user': result.user,
                'result': result,
                'position': i + 1
            })
        
        return rankings

    @classmethod
    def distribute_rewards(cls, olympiad_id):
        """
        Main runner for distributing rewards for a finished olympiad.

        Ilgari butun metod `@transaction.atomic` edi, lekin xato SHU
        metod ichida tutilardi — ya'ni tranzaksiya rollback bo'lmasdi
        va yarim tarqatilgan sovrinlar bazada qolib ketardi, status
        esa 'FAILED' bo'lardi. Endi tarqatish ichki atomic blokda:
        xato chiqsa u blokdan chiqib ketadi va hammasi qaytariladi,
        status esa blokdan TASHQARIDA yoziladi.
        """
        try:
            olympiad = Olympiad.objects.get(id=olympiad_id)
            
            if olympiad.reward_distribution_status == 'COMPLETED':
                logger.warning(f"Rewards already distributed for Olympiad {olympiad_id}")
                return False

            Olympiad.objects.filter(pk=olympiad.pk).update(reward_distribution_status='IN_PROGRESS')

            rankings = cls.calculate_rankings(olympiad)
            prizes = olympiad.prizes.all()

            if not prizes.exists():
                logger.info(f"No prizes defined for Olympiad {olympiad_id}")
                Olympiad.objects.filter(pk=olympiad.pk).update(reward_distribution_status='COMPLETED')
                return True

            distributed_count = 0

            with transaction.atomic():
                # Determine distribution logic based on strategy
                if olympiad.reward_strategy == 'TOP_N':
                    for rank in rankings:
                        # Find prizes for this position
                        pos_prizes = prizes.filter(target_value=rank['position'])
                        for prize in pos_prizes:
                            cls.award_prize(rank['user'], prize, olympiad, rank['position'])
                            distributed_count += 1

                elif olympiad.reward_strategy == 'THRESHOLD':
                    for rank in rankings:
                        # Find prizes where person's score percentage >= target_value
                        # e.g. prize target_value=90 means 90% and above
                        eligible_prizes = prizes.filter(target_value__lte=rank['result'].percentage)
                        for prize in eligible_prizes:
                            cls.award_prize(rank['user'], prize, olympiad, rank['position'])
                            distributed_count += 1

            Olympiad.objects.filter(pk=olympiad.pk).update(reward_distribution_status='COMPLETED')

            logger.info(f"Successfully distributed {distributed_count} rewards for Olympiad {olympiad_id}")
            return True

        except Olympiad.DoesNotExist:
            logger.error(f"Olympiad {olympiad_id} not found")
            return False
        except Exception as e:
            logger.error(f"Error distributing rewards for Olympiad {olympiad_id}: {e}")
            Olympiad.objects.filter(pk=olympiad_id).update(reward_distribution_status='FAILED')
            return False

    @staticmethod
    def _already_awarded(user, prize, olympiad):
        """Shu sovrin shu o'quvchiga allaqachon berilganmi.

        Coin va XP berish IDEMPOTENT emasdi: `distribute_rewards` xatoda
        statusni 'FAILED' qilib qo'yadi, 'COMPLETED' esa emas — ya'ni
        qayta chaqirilsa birinchi marta ulgurgan o'quvchilarga pul va XP
        IKKINCHI marta berilardi. Faqat fizik sovrin tekshirilardi.
        """
        from ..models import ActivityLog

        marker = f"[prize:{prize.id}]"
        if prize.prize_type == 'COIN':
            return Transaction.objects.filter(
                user=user,
                transaction_type='OLYMPIAD_REWARD',
                description__contains=marker,
            ).exists()
        if prize.prize_type == 'XP':
            return ActivityLog.objects.filter(
                user=user,
                activity_type='OLYMPIAD_WIN',
                description__contains=marker,
            ).exists()
        return WinnerPrize.objects.filter(olympiad=olympiad, student=user).exists()

    @classmethod
    def award_prize(cls, user, prize, olympiad, position):
        """
        Award a specific prize to a user.
        """
        if cls._already_awarded(user, prize, olympiad):
            return

        if prize.prize_type == 'COIN':
            cls._award_coin(user, prize, olympiad)
        elif prize.prize_type == 'XP':
            cls._award_xp(user, prize, olympiad)
        elif prize.prize_type == 'PHYSICAL':
            cls._award_physical(user, prize, olympiad, position)

    @staticmethod
    def _award_coin(user, prize, olympiad):
        """Add balance and record transaction"""
        amount = Decimal(str(prize.amount))
        if amount <= 0:
            return

        # F() bilan: bir vaqtda ketgan boshqa yozuv balansni bosib
        # ketmasligi uchun. `user.save()` (update_fields'siz) butun qatorni
        # qayta yozardi.
        User.objects.filter(pk=user.pk).update(balance=models.F('balance') + amount)
        user.refresh_from_db(fields=['balance'])

        Transaction.objects.create(
            user=user,
            transaction_type='OLYMPIAD_REWARD',
            amount=amount,
            status='SUCCESS',
            # `[prize:<id>]` — takroriy berishdan saqlaydigan belgi.
            description=f"Reward for {olympiad.title} [prize:{prize.id}]"
        )
        
        # Notify via Telegram if possible
        if user.telegram_id:
            text = f"🎉 <b>Tabriklaymiz!</b>\n\nSiz <b>{olympiad.title}</b> olimpiadasida g'olib bo'ldingiz va <b>{int(amount)} Coin</b> yutib oldingiz! 🪙\n\nHisobingiz to'ldirildi."
            BotService.send_message(user.telegram_id, text)

    @staticmethod
    def _award_xp(user, prize, olympiad):
        """Add XP to user"""
        amount = int(prize.amount)
        if amount <= 0:
            return

        # `user.xp += amount; user.save()` DARAJANI qayta hisoblamasdi va
        # ActivityLog ham yozmasdi — ya'ni 400 XP olgan o'quvchi eski
        # darajasida qolib ketardi. `add_xp` ikkisini ham bajaradi.
        user.add_xp(
            amount,
            'OLYMPIAD_WIN',
            f"Olimpiada sovrini: {olympiad.title} [prize:{prize.id}]",
        )
        
        # Notify via Telegram if possible
        if user.telegram_id:
            text = f"🎉 <b>Tabriklaymiz!</b>\n\nSiz <b>{olympiad.title}</b> olimpiadasida muvaffaqiyatli qatnashdingiz va <b>{amount} XP</b> tajriba balliga ega bo'ldingiz! 🚀"
            BotService.send_message(user.telegram_id, text)

    @staticmethod
    def _award_physical(user, prize_item, olympiad, position):
        """Create WinnerPrize and trigger bot location request"""
        # check if already awarded
        if WinnerPrize.objects.filter(olympiad=olympiad, student=user).exists():
            return

        winner_prize = WinnerPrize.objects.create(
            olympiad=olympiad,
            student=user,
            position=position,
            prize_item=prize_item,
            status='PENDING'
        )
        
        # Initialize address
        PrizeAddress.objects.create(prize=winner_prize)

        # Notify via Telegram and request location
        BotService.notify_winner(winner_prize)
