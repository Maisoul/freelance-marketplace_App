# Backend Dockerfile
FROM python:3.11-slim as base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc default-libmysqlclient-dev build-essential pkg-config \
 && rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r /app/requirements.txt

# App source
COPY . /app

# Runtime env
ENV DJANGO_SETTINGS_MODULE=marketplace.settings \
    PYTHONPATH=/app

# Collect static (safe if not configured)
RUN python manage.py collectstatic --noinput || true

# Expose port
EXPOSE 8000

# Start server
CMD ["gunicorn", "marketplace.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
