import os
from django.core.mail import send_mail
from django.core.signing import TimestampSigner, SignatureExpired, BadSignature
from django.conf import settings

signer = TimestampSigner()

INVITE_TOKEN_EXPIRY_SECONDS = getattr(settings, 'INVITE_TOKEN_EXPIRY_SECONDS', 60*60*24)  # 24 hours default
SITE_URL = getattr(settings, 'SITE_URL', 'https://yourfrontend.example.com')


def generate_invite_token(email):
    """Generate a signed invite token for the given email."""
    return signer.sign(email)


def verify_invite_token(token):
    """Verify the invite token and return the email if valid and not expired."""
    try:
        email = signer.unsign(token, max_age=INVITE_TOKEN_EXPIRY_SECONDS)
        return email
    except SignatureExpired:
        return None  # Token expired
    except BadSignature:
        return None  # Invalid token


def send_invite_email(email, role='expert'):
    """Send an invite email with a signed token link."""
    token = generate_invite_token(email)
    invite_url = f"{SITE_URL}/invite/accept/?token={token}"
    subject = f"You're invited to join as an {role.capitalize()}"
    message = f"Hello,\n\nYou have been invited to join as an {role}. Please click the link below to accept the invite and register your account.\n\n{invite_url}\n\nThis link will expire in 24 hours.\n\nIf you did not expect this invite, you can ignore this email."
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )
    return invite_url
