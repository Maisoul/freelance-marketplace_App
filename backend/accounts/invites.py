from django.core.signing import Signer
from django.core.mail import send_mail
from django.urls import reverse
from django.conf import settings

signer = Signer()

def send_expert_invite(email, invited_by_user):
    signed = signer.sign(email)
    # build frontend registration URL (React) that accepts ?token=...
    reg_link = settings.SITE_URL + "/register/expert/?token=" + signed
    subject = f"You've been invited to join as an Expert"
    body = f"Hello,\n\n{invited_by_user.get_full_name()} invited you to join the marketplace. Click to register: {reg_link}\n\nThis link pre-fills your email."
    send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [email])
