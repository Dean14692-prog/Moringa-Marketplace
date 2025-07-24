# config.py

import os
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file

class Config:
    # ... other configurations ...

    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    DATABASE_URL = os.getenv('DATABASE_URL')

    # M-Pesa Daraja API Credentials
    MPESA_CONSUMER_KEY = os.getenv('CONSUMER_KEY') # Note: using CONSUMER_KEY from your .env
    MPESA_CONSUMER_SECRET = os.getenv('CONSUMER_SECRET') # Note: using CONSUMER_SECRET from your .env
    MPESA_BUSINESS_SHORT_CODE = os.getenv('SHORTCODE') # Note: using SHORTCODE from your .env
    MPESA_PASS_KEY = os.getenv('PASSKEY') # Note: using PASSKEY from your .env
    # Construct the full callback URL using the BASE_CALLBACK_URL
    MPESA_CALLBACK_URL = f"{os.getenv('BASE_CALLBACK_URL')}/api/mpesa/callback"
    MPESA_ENV = os.getenv('MPESA_ENV', 'sandbox') # Still good to have this to toggle between sandbox/production URLs

    if MPESA_ENV == 'production':
        MPESA_STK_PUSH_URL = 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
        MPESA_TOKEN_URL = 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    else:
        MPESA_STK_PUSH_URL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
        MPESA_TOKEN_URL = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'