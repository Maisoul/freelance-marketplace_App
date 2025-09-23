# Freelance Marketplace

A multi-gateway payment system for freelancers, supporting PayPal, Wise, and M-PESA.

## Features

- Multiple payment gateways:
  - PayPal for global payments
  - Wise for international bank transfers
  - M-PESA for mobile money transactions
- Secure payment processing
- Expert payouts system
- Comprehensive payment tracking
- Status notifications

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd freelance-marketplace
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
```

3. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
cd ../frontend
npm install
```

4. Set up environment variables (create a .env file in the backend directory):
```
# Django settings
DJANGO_SECRET_KEY=your-secret-key
DEBUG=1

# Database settings
MYSQL_DATABASE=your-database-name
MYSQL_USER=your-database-user
MYSQL_PASSWORD=your-database-password
MYSQL_HOST=localhost
MYSQL_PORT=3306

# Email settings
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com

# Payment Gateway Settings
# PayPal settings
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_SANDBOX=True  # Set to False for production

# Wise settings
WISE_API_KEY=your-wise-api-key
WISE_PROFILE_ID=your-wise-profile-id

# M-PESA settings
MPESA_API_KEY=your-mpesa-api-key
MPESA_API_SECRET=your-mpesa-api-secret
MPESA_BUSINESS_SHORTCODE=your-mpesa-business-shortcode
MPESA_PASSKEY=your-mpesa-passkey
MPESA_INITIATOR_NAME=your-mpesa-initiator-name
MPESA_SECURITY_CREDENTIAL=your-mpesa-security-credential
```

5. Run migrations:
```bash
cd backend
python manage.py migrate
```

6. Create a superuser:
```bash
python manage.py createsuperuser
```

7. Start the development servers:

Backend:
```bash
cd backend
python manage.py runserver
```

Frontend:
```bash
cd frontend
npm run dev
```

## API Endpoints

### Payments

#### Payment Intents

- `POST /api/payment-intents/`: Create a new payment intent
- `GET /api/payment-intents/`: List all payment intents (staff only)
- `GET /api/payment-intents/{id}/`: Get payment intent details
- `POST /api/payment-intents/{id}/create_paypal_order/`: Create PayPal order
- `POST /api/payment-intents/{id}/capture_paypal_payment/`: Capture PayPal payment
- `POST /api/payment-intents/{id}/process_mpesa_payment/`: Process M-PESA payment
- `POST /api/payment-intents/{id}/process_wise_payment/`: Process Wise payment
- `POST /api/payment-intents/{id}/refund/`: Refund a payment

#### Expert Payouts

- `GET /api/expert-payouts/`: List expert payouts
- `GET /api/expert-payouts/{id}/`: Get payout details
- `POST /api/expert-payouts/{id}/process_payout/`: Process a payout

#### Expert Payment Methods

- `GET /api/expert-payment-methods/`: List expert's payment methods
- `POST /api/expert-payment-methods/`: Create new payment method
- `GET /api/expert-payment-methods/{id}/`: Get payment method details
- `PUT /api/expert-payment-methods/{id}/`: Update payment method
- `DELETE /api/expert-payment-methods/{id}/`: Delete payment method

## Development

### Adding a New Payment Gateway

1. Create a new service class in `backend/payments/services/`
2. Add necessary settings to `settings.py`
3. Update the `PaymentIntent` model if needed
4. Add new endpoints in the views
5. Update serializers if needed
6. Add documentation for the new endpoints

## Deployment (Docker)

1. Copy environment variables:

- Create a `.env` at repo root based on the keys below:

```
# Required
DJANGO_SECRET_KEY=change-me
DEBUG=0
DJANGO_ALLOWED_HOSTS=yourdomain.com
CORS_ALLOW_ALL_ORIGINS=0
CORS_ALLOWED_ORIGINS=https://yourfrontend.com

MYSQL_DATABASE=tech_freelance_db
MYSQL_USER=app
MYSQL_PASSWORD=changeme
MYSQL_ROOT_PASSWORD=changeme-root
MYSQL_HOST=db
MYSQL_PORT=3306

EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=your@gmail.com
EMAIL_HOST_PASSWORD=app-password
DEFAULT_FROM_EMAIL=no-reply@yourdomain.com
SITE_URL=https://yourfrontend.com/

# Optional
OPENAI_API_KEY=

PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_SANDBOX=True
WISE_API_KEY=
WISE_PROFILE_ID=
MPESA_API_KEY=
MPESA_API_SECRET=
MPESA_BUSINESS_SHORTCODE=
MPESA_PASSKEY=
MPESA_INITIATOR_NAME=
MPESA_SECURITY_CREDENTIAL=

VITE_API_URL=https://api.yourdomain.com
```

2. Build and run:

```
docker compose build
docker compose up -d
```

3. Initialize database and admin:

```
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

4. Access services:

- API: http://localhost:8000
- Frontend: http://localhost:5173

## Production notes

- Set proper `DJANGO_ALLOWED_HOSTS` and restrict CORS.
- Configure reverse proxy (e.g., Nginx) with TLS for both API and frontend.
- Set up email credentials for invite emails.
- Provide payment provider credentials (PayPal/Wise/M-Pesa) before enabling real payments.