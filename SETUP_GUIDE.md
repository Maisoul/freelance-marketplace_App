# Mai-Guru Platform Setup Guide

## 🚀 Quick Start (Without Docker)

Since Docker is not installed on your system, here's how to set up the Mai-Guru platform locally:

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL 8.0+
- Git

## 📋 Step-by-Step Setup

### 1. Database Setup (MySQL)

First, install and configure MySQL:

```bash
# Download MySQL from: https://dev.mysql.com/downloads/mysql/
# Or use MySQL Installer for Windows

# Create database
mysql -u root -p
CREATE DATABASE maiguru_db;
CREATE USER 'maiguru_user'@'localhost' IDENTIFIED BY 'maiguru123';
GRANT ALL PRIVILEGES ON maiguru_db.* TO 'maiguru_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Backend Setup (Django)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy env.example .env
# Edit .env with your configuration:
# - DB_PASSWORD=maiguru123
# - SECRET_KEY=your-secret-key-here
# - OPENAI_API_KEY=your-openai-key (optional)

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
# Username: admin
# Email: admin@maiguru.com
# Password: sPring@bOks%1573$

# Start backend server
python manage.py runserver
```

### 3. Frontend Setup (React)

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Start frontend server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
- **Admin Login**: Click logo on landing page or go to http://localhost:3000/admin/login

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=maiguru_db
DB_USER=maiguru_user
DB_PASSWORD=maiguru123
DB_HOST=localhost
DB_PORT=3306
OPENAI_API_KEY=your-openai-key
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:8000
```

## 🎯 Testing the Platform

### 1. Landing Page
- Visit http://localhost:3000
- Verify Mai-Guru branding and "Tell a Friend to Tell a Friend 🙂" slogan
- Check all sections: Hero, KPI cards, Core Values, Services, CEO section

### 2. Admin Access
- Click the logo on landing page
- Use password: `sPring@bOks%1573$`
- Access admin dashboard

### 3. Client Registration
- Click "Start Your Project" or "Sign Up"
- Register as a client (Student or Organization)
- Submit a test task

### 4. Expert Invitation
- From admin dashboard, invite an expert
- Check email for invitation link
- Register as expert using the invitation

## 🛠️ Development Commands

### Backend Commands
```bash
# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run tests
python manage.py test

# Start development server
python manage.py runserver

# Start Celery worker (for background tasks)
celery -A marketplace worker -l info
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check database credentials in .env
   - Verify database exists

2. **Port Already in Use**
   - Backend: Change port in `python manage.py runserver 8001`
   - Frontend: Change port in `npm run dev -- --port 3001`

3. **Module Not Found**
   - Ensure virtual environment is activated
   - Run `pip install -r requirements.txt`

4. **CORS Errors**
   - Check CORS settings in backend settings.py
   - Ensure frontend URL is in ALLOWED_HOSTS

### Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Check database connection

## 🚀 Production Deployment

For production deployment:

1. **Set DEBUG=False** in backend .env
2. **Configure production database**
3. **Set up proper email configuration**
4. **Configure payment gateway credentials**
5. **Set up SSL certificates**
6. **Configure domain and hosting**

## 📞 Support

For technical support or questions:
- Check the README.md for detailed documentation
- Review the code comments for implementation details
- Ensure all prerequisites are installed correctly

---

**Mai-Guru Platform** - *Tell a Friend to Tell a Friend* 🙂
*Integrity, Quality & Prompt Service*
