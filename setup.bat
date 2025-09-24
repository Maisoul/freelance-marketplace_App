@echo off
echo ========================================
echo    Mai-Guru Platform Setup Script
echo ========================================
echo.

echo [1/6] Setting up Backend...
cd backend

echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing Python dependencies...
pip install -r requirements.txt

echo Creating .env file...
if not exist .env (
    copy env.example .env
    echo Please edit backend\.env with your configuration
)

echo Running migrations...
python manage.py makemigrations
python manage.py migrate

echo Creating superuser...
echo Please use these credentials:
echo Username: admin
echo Email: admin@maiguru.com
echo Password: sPring@bOks%%1573$
python manage.py createsuperuser

echo.
echo [2/6] Setting up Frontend...
cd ..\frontend

echo Installing Node.js dependencies...
npm install

echo Creating .env file...
if not exist .env (
    echo VITE_API_URL=http://localhost:8000 > .env
)

echo.
echo [3/6] Setup Complete!
echo.
echo To start the application:
echo 1. Backend: cd backend && venv\Scripts\activate && python manage.py runserver
echo 2. Frontend: cd frontend && npm run dev
echo.
echo Access URLs:
echo - Frontend: http://localhost:3000
echo - Backend: http://localhost:8000
echo - Admin: http://localhost:8000/admin
echo.
echo Admin Login:
echo - Password: sPring@bOks%%1573$
echo.
echo ========================================
pause
