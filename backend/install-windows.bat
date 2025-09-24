@echo off
echo ========================================
echo    Mai-Guru Windows Installation Fix
echo ========================================
echo.

echo Installing Windows-compatible dependencies...
echo.

echo [1/4] Installing core dependencies...
pip install Django==4.2.7
pip install djangorestframework==3.14.0
pip install django-cors-headers==4.3.1
pip install djangorestframework-simplejwt==5.3.0

echo [2/4] Installing database dependencies...
pip install PyMySQL==1.1.0
pip install django-environ==0.11.2

echo [3/4] Installing AI and utility dependencies...
pip install openai==1.3.0
pip install beautifulsoup4==4.12.2
pip install requests==2.31.0
pip install paypalrestsdk==1.13.3
pip install requests-oauthlib==1.3.1

echo [4/4] Installing remaining dependencies...
pip install Pillow==10.0.1
pip install celery==5.3.4
pip install redis==5.0.1
pip install django-celery-beat==2.5.0
pip install cryptography==41.0.7
pip install django-debug-toolbar==4.2.0
pip install django-extensions==3.2.3
pip install gunicorn==21.2.0
pip install whitenoise==6.6.0
pip install python-dateutil==2.8.2
pip install pytz==2023.3

echo.
echo ========================================
echo    Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Create .env file: copy env.example .env
echo 2. Run migrations: python manage.py makemigrations
echo 3. Apply migrations: python manage.py migrate
echo 4. Create superuser: python manage.py createsuperuser
echo 5. Start server: python manage.py runserver
echo.
pause
