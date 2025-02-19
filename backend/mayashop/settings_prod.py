from .settings import *
import os
import dj_database_url

DEBUG = False
ALLOWED_HOSTS = ['*']  # Replace with your Render domain later

# Database
DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///db.sqlite3',
        conn_max_age=600
    )
}

# Static files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "https://mayashop-iitech385.netlify.app",  # Replace with your actual Netlify domain
]
CORS_ALLOW_CREDENTIALS = True

# Security
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True 