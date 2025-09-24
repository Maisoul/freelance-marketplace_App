# Mai-Guru: AI-Powered Freelance Platform

## 🎯 Project Overview
Mai-Guru is a comprehensive AI-powered freelance platform designed to connect students, organizations, and freelancers with elite tech experts. The platform features dynamic pricing through web scraping, real-time project management, and integrated payment systems.

## 🚀 Key Features

### Core Platform
- **AI-Powered Dynamic Pricing**: Real-time market analysis and competitive quotes
- **Multi-Role System**: Clients, Experts, and Admin with role-based access
- **Real-Time Communication**: Integrated chat system for project collaboration
- **Payment Integration**: M-Pesa Global, PayPal, and Wise support
- **SEO Optimized**: Built for search visibility from day one

### Service Categories
- **Web Development**: React, Node.js, Python, Django
- **AI & Machine Learning**: AI agents, chatbots, automation, NLP
- **Cybersecurity**: Penetration testing, security audits, incident response
- **Technical Writing**: Academic and technical documentation

## 🛠 Technology Stack

### Backend
- **Framework**: Django 4.2+ (Python)
- **Database**: MySQL 8.0
- **Authentication**: JWT with role-based access control
- **AI Integration**: OpenAI API for chatbots and price suggestions
- **Payment**: M-Pesa Global, PayPal, Wise APIs
- **Web Scraping**: BeautifulSoup, Scrapy for market analysis

### Frontend
- **Framework**: React 18+ with TypeScript
- **UI Library**: Chakra UI
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Build Tool**: Vite

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Deployment**: Production-ready with environment configuration
- **SEO**: Schema markup, meta tags, performance optimization

## 📁 Project Structure

```
freelance-marketplace/
├── backend/                 # Django backend
│   ├── accounts/           # User management
│   ├── tasks/              # Task/project management
│   ├── payments/           # Payment processing
│   ├── ai/                 # AI services (chatbot, pricing)
│   ├── messages/           # Communication system
│   └── marketplace/        # Main Django project
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript definitions
├── docker-compose.yml      # Development environment
├── Dockerfile.backend      # Backend container
├── Dockerfile.frontend     # Frontend container
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL 8.0+
- Docker (optional)

### Development Setup

1. **Clone and Setup**
```bash
git clone <repository-url>
cd freelance-marketplace
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

4. **Docker Setup (Alternative)**
```bash
docker-compose up --build
```

### Environment Variables
Create `.env` files in both backend and frontend directories:

**Backend (.env)**
```env
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=mysql://user:password@localhost:3306/maiguru_db
OPENAI_API_KEY=your-openai-key
EMAIL_HOST_USER=your-email
EMAIL_HOST_PASSWORD=your-email-password
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:8000
```

## 🎯 User Roles & Access

### Admin (Super User)
- **Login**: Password-based authentication
- **Dashboard**: Task management, expert invitations, payment processing
- **AI Tools**: Chatbot for client support, pricing suggestions
- **Management**: User management, system analytics

### Clients
- **Registration**: Student or Organization packages
- **Task Submission**: Detailed project requirements with file uploads
- **Dashboard**: Project tracking, payment management, communication
- **Support**: AI chatbot for assistance

### Experts
- **Invitation**: Email-based invitation system with 24-hour expiry
- **Registration**: Pre-populated forms with expertise selection
- **Dashboard**: Project details, submission management, client communication

## 💰 Monetization Model

1. **Commission Fee**: 10% on projects secured through platform
2. **Subscription Tiers**: Expert "Pro" profiles ($19/month) - Future
3. **AI Pricing Reports**: Market analysis reports ($49/report) - Future

## 🔒 Security Features

- **Authentication**: JWT-based with role-based access control
- **Data Encryption**: Sensitive data encryption at rest and in transit
- **File Upload Security**: Validated file types and size limits
- **Payment Security**: PCI-compliant payment processing
- **Admin Security**: Secure superuser authentication

## 📈 SEO Strategy

### Technical SEO
- **URL Structure**: Clean, descriptive URLs (/services/ai-development/)
- **Schema Markup**: Service, WebPage, Article schemas
- **Performance**: Optimized loading speeds, mobile-first design
- **Meta Tags**: Dynamic meta descriptions and titles

### Content Strategy
- **Target Keywords**: "AI development services", "cybersecurity consulting", "Python web developer"
- **Content Engine**: Integrated blog for cornerstone content
- **Link Building**: White-hat strategies for domain authority

## 🧪 Testing

### Backend Testing
```bash
cd backend
python manage.py test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Security Testing
- Authentication flow testing
- File upload validation
- Payment processing security
- Admin access controls

## 🚀 Deployment

### Production Environment
1. **Backend**: Deploy Django app with Gunicorn
2. **Frontend**: Build and serve static files
3. **Database**: MySQL with proper indexing
4. **CDN**: Static asset delivery
5. **SSL**: HTTPS enforcement

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Analytics & Monitoring

- **User Analytics**: Google Analytics integration
- **Performance Monitoring**: Application performance tracking
- **Error Tracking**: Comprehensive error logging
- **Payment Monitoring**: Transaction tracking and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and inquiries:
- **Email**: support@maiguru.com
- **Documentation**: [Link to documentation]
- **Issues**: [GitHub Issues]

---

**Mai-Guru** - *Tell a Friend to Tell a Friend* 🙂
*Integrity, Quality & Prompt Service*