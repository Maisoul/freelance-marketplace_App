from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os


class Command(BaseCommand):
	help = "Create an initial superuser from environment variables if not exists"

	def handle(self, *args, **options):
		User = get_user_model()
		username = os.getenv('DJANGO_SUPERUSER_USERNAME')
		email = os.getenv('DJANGO_SUPERUSER_EMAIL')
		password = os.getenv('DJANGO_SUPERUSER_PASSWORD')

		if not (username and email and password):
			self.stdout.write(self.style.WARNING('Missing env vars: DJANGO_SUPERUSER_USERNAME, DJANGO_SUPERUSER_EMAIL, DJANGO_SUPERUSER_PASSWORD'))
			return

		if User.objects.filter(username=username).exists():
			self.stdout.write(self.style.SUCCESS('Superuser already exists.'))
			return

		User.objects.create_superuser(username=username, email=email, password=password)
		self.stdout.write(self.style.SUCCESS(f'Superuser {username} created.'))
