"""O'qituvchilarning kutib turgan (pending) pulini yechib olinadigan balansga o'tkazadi.

Bu ishni hech narsa chaqirmayotgan edi: `WalletService.release_pending_balance`
yozilgan, lekin na view, na cron undan foydalanmasdi. Natijada kurs sotuvidan
tushgan pul `pending_balance` da abadiy qotib qolardi — o'qituvchi hech qachon
yechib ololmasdi.

Kuniga bir marta cron orqali chaqirilsin:

    0 3 * * * cd /path/to/backend && venv/bin/python manage.py release_pending_balance
"""

from django.core.management.base import BaseCommand

from api.services.wallet_service import WalletService


class Command(BaseCommand):
    help = "Muddati yetgan pending balansni o'qituvchilarning asosiy balansiga o'tkazadi"

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help="Hech narsani o'zgartirmasdan, nechta tranzaksiya ochilishini ko'rsatadi",
        )

    def handle(self, *args, **options):
        if options['dry_run']:
            from django.conf import settings
            from django.utils import timezone
            from datetime import timedelta

            from api.models import Transaction

            pending_days = getattr(settings, 'PENDING_BALANCE_DAYS', 7)
            cutoff = timezone.now() - timedelta(days=pending_days)
            count = Transaction.objects.filter(
                transaction_type='COURSE_SALE',
                status='SUCCESS',
                created_at__lte=cutoff,
            ).exclude(metadata__has_key='released').count()
            self.stdout.write(f"{count} ta tranzaksiya ochilishga tayyor (dry-run).")
            return

        released = WalletService.release_pending_balance()
        self.stdout.write(self.style.SUCCESS(f"{released} ta tranzaksiya ochildi."))
