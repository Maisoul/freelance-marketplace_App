# Mai-Guru Windows Installation Fix Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Mai-Guru Windows Installation Fix" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Installing Windows-compatible dependencies..." -ForegroundColor Yellow
Write-Host ""

# Install packages one by one to avoid conflicts
$packages = @(
    "Django==4.2.7",
    "djangorestframework==3.14.0",
    "django-cors-headers==4.3.1",
    "djangorestframework-simplejwt==5.3.0",
    "PyMySQL==1.1.0",
    "django-environ==0.11.2",
    "openai==1.3.0",
    "beautifulsoup4==4.12.2",
    "requests==2.31.0",
    "paypalrestsdk==1.13.3",
    "requests-oauthlib==1.3.1",
    "Pillow==10.0.1",
    "celery==5.3.4",
    "redis==5.0.1",
    "django-celery-beat==2.5.0",
    "cryptography==41.0.7",
    "django-debug-toolbar==4.2.0",
    "django-extensions==3.2.3",
    "gunicorn==21.2.0",
    "whitenoise==6.6.0",
    "python-dateutil==2.8.2",
    "pytz==2023.3"
)

$successCount = 0
$totalCount = $packages.Count

foreach ($package in $packages) {
    try {
        Write-Host "Installing $package..." -ForegroundColor Blue
        pip install $package --quiet
        Write-Host "✓ $package installed successfully" -ForegroundColor Green
        $successCount++
    } catch {
        Write-Host "✗ Failed to install $package" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Installation Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Successfully installed: $successCount/$totalCount packages" -ForegroundColor Green
Write-Host ""

if ($successCount -eq $totalCount) {
    Write-Host "✓ All packages installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Create .env file: copy env.example .env" -ForegroundColor White
    Write-Host "2. Run migrations: python manage.py makemigrations" -ForegroundColor White
    Write-Host "3. Apply migrations: python manage.py migrate" -ForegroundColor White
    Write-Host "4. Create superuser: python manage.py createsuperuser" -ForegroundColor White
    Write-Host "5. Start server: python manage.py runserver" -ForegroundColor White
} else {
    Write-Host "⚠ Some packages failed to install. You may need to install them manually." -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to continue"
