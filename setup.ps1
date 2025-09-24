# Mai-Guru Platform Setup Script for PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Mai-Guru Platform Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found. Please install Python 3.11+" -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[1/6] Setting up Backend..." -ForegroundColor Yellow
Set-Location backend

# Create virtual environment
Write-Host "Creating virtual environment..." -ForegroundColor Blue
python -m venv venv

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Blue
& ".\venv\Scripts\Activate.ps1"

# Install dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Blue
pip install -r requirements.txt

# Create .env file
if (-not (Test-Path ".env")) {
    Copy-Item "env.example" ".env"
    Write-Host "✓ Created .env file. Please edit with your configuration." -ForegroundColor Green
} else {
    Write-Host "✓ .env file already exists." -ForegroundColor Green
}

# Run migrations
Write-Host "Running migrations..." -ForegroundColor Blue
python manage.py makemigrations
python manage.py migrate

# Create superuser
Write-Host ""
Write-Host "Creating superuser..." -ForegroundColor Blue
Write-Host "Please use these credentials:" -ForegroundColor Yellow
Write-Host "Username: admin" -ForegroundColor Yellow
Write-Host "Email: admin@maiguru.com" -ForegroundColor Yellow
Write-Host "Password: sPring@bOks%1573$" -ForegroundColor Yellow
python manage.py createsuperuser

Write-Host ""
Write-Host "[2/6] Setting up Frontend..." -ForegroundColor Yellow
Set-Location ..\frontend

# Install Node.js dependencies
Write-Host "Installing Node.js dependencies..." -ForegroundColor Blue
npm install

# Create .env file
if (-not (Test-Path ".env")) {
    "VITE_API_URL=http://localhost:8000" | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✓ Created frontend .env file." -ForegroundColor Green
} else {
    Write-Host "✓ Frontend .env file already exists." -ForegroundColor Green
}

Write-Host ""
Write-Host "[3/6] Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "1. Backend: cd backend && .\venv\Scripts\Activate.ps1 && python manage.py runserver" -ForegroundColor White
Write-Host "2. Frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Access URLs:" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "- Backend: http://localhost:8000" -ForegroundColor White
Write-Host "- Admin: http://localhost:8000/admin" -ForegroundColor White
Write-Host ""
Write-Host "Admin Login:" -ForegroundColor Cyan
Write-Host "- Password: sPring@bOks%1573$" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

# Return to root directory
Set-Location ..

Read-Host "Press Enter to continue"
