import requests
from requests.auth import HTTPBasicAuth
import datetime
import base64
import json
import os
from dotenv import load_dotenv # pip install python-dotenv

# Load environment variables from .env file
load_dotenv()

class MpesaService:
    def __init__(self):
        self.consumer_key = os.getenv('CONSUMER_KEY')
        self.consumer_secret = os.getenv('CONSUMER_SECRET')
        self.business_shortcode = os.getenv('SHORTCODE', '174379') # Default to sandbox
        self.passkey = os.getenv('PASSKEY')
        self.callback_url = os.getenv('MPESA_CALLBACK_URL') # Expecting full URL like https://ngrok.io/api/mpesa/callback

        # Determine environment and set URLs
        mpesa_env = os.getenv('MPESA_ENV', 'sandbox').lower()
        if mpesa_env == 'production':
            self.oauth_url = 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
            self.stk_push_url = 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
        else: # sandbox
            self.oauth_url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
            self.stk_push_url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'

        # Basic validation for essential keys
        if not all([self.consumer_key, self.consumer_secret, self.passkey, self.callback_url]):
            raise ValueError("M-Pesa API credentials and callback URL must be set in environment variables.")

    def _get_access_token(self):
        """Generates and returns an M-Pesa OAuth access token."""
        try:
            response = requests.get(self.oauth_url, auth=HTTPBasicAuth(self.consumer_key, self.consumer_secret))
            response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)
            return response.json().get('access_token')
        except requests.exceptions.RequestException as e:
            print(f"Error connecting to M-Pesa OAuth service: {e}")
            raise
        except json.JSONDecodeError:
            print(f"Error decoding JSON from M-Pesa OAuth response: {response.text}")
            raise
        except Exception as e:
            print(f"An unexpected error occurred while getting access token: {e}")
            raise

    def _generate_timestamp(self):
        """Generates the M-Pesa API compliant timestamp."""
        return datetime.datetime.now().strftime('%Y%m%d%H%M%S')

    def _generate_password(self, timestamp):
        """Generates the M-Pesa password for STK Push."""
        data_to_encode = f"{self.business_shortcode}{self.passkey}{timestamp}"
        return base64.b64encode(data_to_encode.encode('utf-8')).decode('utf-8')

    def initiate_stk_push(self, phone_number, amount, account_reference, transaction_desc="Online Payment"):
        """
        Initiates an M-Pesa STK Push transaction.

        Args:
            phone_number (str): Customer's M-Pesa registered phone number (e.g., 2547XXXXXXXX).
            amount (float/int): The amount to be paid. Will be converted to int.
            account_reference (str): A unique identifier for the transaction (e.g., order ID).
            transaction_desc (str): A short description for the transaction.
        Returns:
            dict: The JSON response from the M-Pesa STK Push API.
        Raises:
            Exception: If an error occurs during the process.
        """
        try:
            access_token = self._get_access_token()
            timestamp = self._generate_timestamp()
            password = self._generate_password(timestamp)

            # M-Pesa STK Push expects amount as an integer
            amount_int = int(amount) # Or math.ceil(amount) if you need to round up cents

            payload = {
                "BusinessShortCode": self.business_shortcode,
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline", # Use "CustomerBuyGoodsOnline" for Till numbers
                "Amount": amount_int,
                "PartyA": phone_number,
                "PartyB": self.business_shortcode,
                "PhoneNumber": phone_number,
                "CallBackURL": self.callback_url,
                "AccountReference": account_reference,
                "TransactionDesc": transaction_desc
            }

            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }

            response = requests.post(self.stk_push_url, json=payload, headers=headers)
            response.raise_for_status() # Raise HTTPError for bad responses
            return response.json()

        except requests.exceptions.RequestException as e:
            print(f"Error connecting to M-Pesa STK Push service: {e}")
            if e.response is not None:
                print(f"M-Pesa API Error Response: {e.response.text}")
            raise
        except json.JSONDecodeError:
            print(f"Error decoding JSON from M-Pesa STK Push response: {response.text}")
            raise
        except ValueError as e:
            print(f"Configuration error: {e}")
            raise
        except Exception as e:
            print(f"An unexpected error occurred during STK Push: {e}")
            raise

# Example Usage (for testing purposes, in a separate script or main block)
if __name__ == "__main__":
    # Ensure your .env file is correctly set up with real (sandbox) credentials
    # and your ngrok tunnel is running and its URL is in MPESA_CALLBACK_URL in .env

    try:
        mpesa_service = MpesaService()

        test_phone_number = os.getenv('TEST_MPESA_PHONE_NUMBER', '254708374149') # Safaricom sandbox test number
        test_amount = 1 # Minimum amount for sandbox is usually 1
        test_account_reference = "ORDER" + datetime.datetime.now().strftime("%Y%m%d%H%M%S") # Unique reference

        print(f"Attempting STK Push for {test_phone_number} with amount {test_amount}...")
        response = mpesa_service.initiate_stk_push(
            phone_number=test_phone_number,
            amount=test_amount,
            account_reference=test_account_reference,
            transaction_desc="Moringa Marketplace Test"
        )
        print("STK Push initiated. Response:")
        print(json.dumps(response, indent=2))

        if response.get('ResponseCode') == '0':
            print("\nSTK Push request successful. Check your phone for the M-Pesa prompt.")
            print(f"CheckoutRequestID: {response.get('CheckoutRequestID')}")
        else:
            print(f"\nSTK Push request failed: {response.get('ResponseDescription')}")

    except ValueError as ve:
        print(f"Configuration Error: {ve}")
        print("Please ensure CONSUMER_KEY, CONSUMER_SECRET, PASSKEY, and MPESA_CALLBACK_URL are set in your .env file.")
    except Exception as e:
        print(f"An error occurred: {e}")