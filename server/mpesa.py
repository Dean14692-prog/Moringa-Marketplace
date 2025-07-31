

###########################################################################################
# Better than code 1

# import requests
# import base64
# import datetime
# import os

# def get_access_token():
#     consumer_key = os.getenv("MPESA_CONSUMER_KEY")
#     consumer_secret = os.getenv("MPESA_CONSUMER_SECRET")
#     auth_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

#     try:
#         response = requests.get(auth_url, auth=(consumer_key, consumer_secret))

#         # --- ADD THESE PRINT STATEMENTS FOR DEBUGGING ---
#         print("M-Pesa Access Token API Status Code:", response.status_code)
#         print("M-Pesa Access Token API Raw Response Text:", response.text)
#         # --------------------------------------------------

#         response.raise_for_status() # Raise an exception for 4XX/5XX status codes

#         # Only attempt to parse JSON if the request was successful
#         return response.json().get("access_token")

#     except requests.exceptions.HTTPError as e:
#         print(f"HTTP Error fetching access token: {e}")
#         if e.response is not None:
#             print(f"Error response content: {e.response.text}")
#         return None
#     except requests.exceptions.RequestException as e:
#         print(f"Network/Request Error fetching access token: {e}")
#         return None
#     except ValueError as e: # Catch JSONDecodeError specifically here
#         print(f"JSON Decode Error fetching access token (response was not JSON): {e}")
#         print(f"Response text that caused the error: {response.text}") # Re-print in case it was missed
#         return None

# def lipa_na_mpesa_online(phone_number, amount):
#     access_token = get_access_token()
#     if not access_token:
#         print("Failed to get access token. Aborting STK Push.")
#         return {"error": "Failed to get access token"} # Handle gracefully

#     timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
#     business_short_code = os.getenv("MPESA_BUSINESS_SHORT_CODE")
#     passkey = os.getenv("MPESA_PASS_KEY")
#     data_to_encode = business_short_code + passkey + timestamp
#     password = base64.b64encode(data_to_encode.encode()).decode("utf-8")

#     payload = {
#         "BusinessShortCode": business_short_code,
#         "Password": password,
#         "Timestamp": timestamp,
#         "TransactionType": "CustomerPayBillOnline",
#         "Amount": amount,
#         "PartyA": phone_number,
#         "PartyB": business_short_code,
#         "PhoneNumber": phone_number,
#         "CallBackURL": os.getenv("BASE_CALLBACK_URL") + "/api/mpesa/callback",
#         "AccountReference": "CompanyXLTD",
#         "TransactionDesc": "Payment of X"
#     }

#     headers = {
#         "Authorization": f"Bearer {access_token}",
#         "Content-Type": "application/json"
#     }

#     try:
#         response = requests.post(
#             "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
#             json=payload,
#             headers=headers
#         )
#         print("STK Push API Status Code:", response.status_code)
#         print("STK Push API Raw Response Text:", response.text)
#         response.raise_for_status()
#         return response.json()
#     except requests.exceptions.HTTPError as e:
#         print(f"HTTP Error during STK Push: {e}")
#         if e.response is not None:
#             print(f"Error response content: {e.response.text}")
#         return {"error": f"STK Push HTTP Error: {e.response.text if e.response else e}"}
#     except requests.exceptions.RequestException as e:
#         print(f"Network/Request Error during STK Push: {e}")
#         return {"error": f"STK Push Request Error: {e}"}
#     except ValueError as e:
#         print(f"JSON Decode Error during STK Push (response was not JSON): {e}")
#         print(f"Response text that caused the error: {response.text}")
#         return {"error": f"STK Push JSON Error: {response.text}"}
    
# ###############################################################################################

# import requests
# import base64
# import datetime
# import os
# import json # Import json to handle potential non-JSON responses gracefully

# # --- Configuration Constants (Can also be loaded from .env if preferred) ---
# # M-Pesa Sandbox URLs
# MPESA_AUTH_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
# MPESA_STK_PUSH_URL = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
# # -------------------------------------------------------------------------

# def get_access_token():
#     """
#     Fetches the M-Pesa API access token.
#     Uses environment variables for Consumer Key and Secret.
#     """
#     consumer_key = os.getenv("MPESA_CONSUMER_KEY")
#     consumer_secret = os.getenv("MPESA_CONSUMER_SECRET")

#     # --- DEBUGGING PRINTS FOR ENVIRONMENT VARIABLES ---
#     # These lines are crucial for debugging. REMOVE OR SECURELY LOG IN PRODUCTION!
#     print(f"DEBUG: Loaded MPESA_CONSUMER_KEY: {'*' * (len(consumer_key) - 5) + consumer_key[-5:] if consumer_key else 'NOT SET'}")
#     print(f"DEBUG: Loaded MPESA_CONSUMER_SECRET: {'*' * (len(consumer_secret) - 5) + consumer_secret[-5:] if consumer_secret else 'NOT SET'}")
#     print(f"DEBUG: Type of consumer_key: {type(consumer_key)}")
#     print(f"DEBUG: Type of consumer_secret: {type(consumer_secret)}")
#     # ---------------------------------------------------

#     if not consumer_key or not consumer_secret:
#         print("ERROR: MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET environment variables are not set. Cannot proceed.")
#         return None

#     try:
#         # requests.get with auth parameter handles basic authentication by encoding the credentials
#         response = requests.get(MPESA_AUTH_URL, auth=(consumer_key, consumer_secret))

#         # --- DEBUGGING PRINTS FOR API RESPONSE ---
#         print(f"M-Pesa Access Token API Status Code: {response.status_code}")
#         print(f"M-Pesa Access Token API Raw Response Text: {response.text}")
#         # ------------------------------------------

#         # Raise an exception for HTTP errors (4xx or 5xx)
#         response.raise_for_status()

#         # Try to parse as JSON. If it's not JSON, a ValueError (JSONDecodeError) will be raised.
#         try:
#             json_response = response.json()
#             # Safaricom API usually returns 'access_token' and 'expires_in'
#             access_token = json_response.get("access_token")
#             if access_token:
#                 return access_token
#             else:
#                 print(f"ERROR: 'access_token' not found in JSON response from M-Pesa. Response: {json_response}")
#                 return None
#         except json.JSONDecodeError as e:
#             print(f"JSON Decode Error: Response was not valid JSON from Access Token API. Error: {e}")
#             print(f"Problematic response text: {response.text}")
#             return None

#     except requests.exceptions.HTTPError as e:
#         print(f"HTTP Error fetching access token: {e}")
#         if e.response is not None:
#             print(f"Error response content: {e.response.text}")
#         return None
#     except requests.exceptions.ConnectionError as e:
#         print(f"Connection Error fetching access token (e.g., no internet, DNS issue): {e}")
#         return None
#     except requests.exceptions.Timeout as e:
#         print(f"Timeout Error fetching access token: {e}")
#         return None
#     except requests.exceptions.RequestException as e:
#         print(f"An unexpected Request Error occurred fetching access token: {e}")
#         return None
#     except Exception as e:
#         print(f"An unexpected error occurred in get_access_token: {e}")
#         return None


# def lipa_na_mpesa_online(phone_number, amount):
#     """
#     Initiates an M-Pesa STK Push transaction.
#     """
#     access_token = get_access_token()
#     if not access_token:
#         print("Failed to get access token. Aborting STK Push.")
#         return {"error": "Failed to get access token", "status": "failed"} # Return structured error

#     timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    
#     # Corrected variable names to match your .env file
#     business_short_code = os.getenv("MPESA_BUSINESS_SHORT_CODE") # Reads 'SHORTCODE' from .env
#     passkey = os.getenv("MPESA_PASS_KEY") # Reads 'PASSKEY' from .env
    
#     callback_url = os.getenv("BASE_CALLBACK_URL") + "/api/mpesa/callback" # Using BASE_CALLBACK_URL from .env

#     # --- TEMPORARY DEBUGGING PRINTS FOR STK PUSH ENV VARS ---
#     print(f"DEBUG: Loaded MPESA_BUSINESS_SHORT_CODE: {business_short_code}")
#     print(f"DEBUG: Loaded MPESA_PASS_KEY (first 5 chars): {'*' * (len(passkey) - 5) + passkey[-5:] if passkey else 'NOT SET'}")
#     print(f"DEBUG: Callback URL: {callback_url}")
#     # --------------------------------------------------------

#     if not business_short_code or not passkey or not callback_url:
#         print("ERROR: One or more STK Push environment variables (MPESA_BUSINESS_SHORT_CODE, MPESA_PASS_KEY, BASE_CALLBACK_URL) are not set. Cannot proceed with STK Push.")
#         return {"error": "Missing STK Push configuration", "status": "failed"}

#     # Ensure integer values are treated as such before concatenation
#     try:
#         business_short_code_int = int(business_short_code)
#         amount_int = int(amount)
#     except (ValueError, TypeError):
#         print("ERROR: Business Short Code or Amount could not be converted to integer.")
#         return {"error": "Invalid Business Short Code or Amount format", "status": "failed"}

#     data_to_encode = str(business_short_code_int) + passkey + timestamp
#     password = base64.b64encode(data_to_encode.encode("utf-8")).decode("utf-8") # Ensure UTF-8 encoding

#     # M-Pesa phone numbers should be in the 254... format
#     phone_number_str = str(phone_number) # Ensure it's a string
#     if not phone_number_str.startswith("254"):
#         # Attempt to convert common formats to 254...
#         if phone_number_str.startswith("07") or phone_number_str.startswith("01"):
#             phone_number_str = "254" + phone_number_str[1:]
#         elif phone_number_str.startswith("+254"):
#             phone_number_str = phone_number_str[1:] # Remove '+'
#         else:
#             print(f"WARNING: Phone number '{phone_number_str}' might be in an unexpected format. Please ensure it's 254XXXXXXXXX.")

#     payload = {
#         "BusinessShortCode": business_short_code_int,
#         "Password": password,
#         "Timestamp": timestamp,
#         "TransactionType": "CustomerPayBillOnline", # Or "CustomerBuyGoodsOnline" if applicable
#         "Amount": amount_int,
#         "PartyA": phone_number_str,
#         "PartyB": business_short_code_int, # Same as BusinessShortCode for PayBill
#         "PhoneNumber": phone_number_str,
#         "CallBackURL": callback_url,
#         "AccountReference": "CompanyXLTD", # This is often an invoice number or unique ID
#         "TransactionDesc": "Payment for goods/services"
#     }

#     # --- DEBUGGING PRINT FOR STK PUSH PAYLOAD ---
#     print(f"DEBUG: STK Push Payload: {json.dumps(payload, indent=2)}")
#     # --------------------------------------------

#     headers = {
#         "Authorization": f"Bearer {access_token}",
#         "Content-Type": "application/json"
#     }

#     try:
#         response = requests.post(
#             MPESA_STK_PUSH_URL,
#             json=payload, # Use json=payload for requests to send as JSON
#             headers=headers
#         )

#         # --- DEBUGGING PRINTS FOR STK PUSH RESPONSE ---
#         print(f"STK Push API Status Code: {response.status_code}")
#         print(f"STK Push API Raw Response Text: {response.text}")
#         # -----------------------------------------------

#         response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)

#         try:
#             return response.json()
#         except json.JSONDecodeError as e:
#             print(f"JSON Decode Error: Response was not valid JSON from STK Push API. Error: {e}")
#             print(f"Problematic response text: {response.text}")
#             return {"error": "Invalid JSON response from STK Push API", "raw_response": response.text, "status": "failed"}

#     except requests.exceptions.HTTPError as e:
#         print(f"HTTP Error during STK Push: {e}")
#         if e.response is not None:
#             print(f"Error response content: {e.response.text}")
#             return {"error": f"STK Push HTTP Error: {e.response.text}", "status_code": e.response.status_code, "status": "failed"}
#         return {"error": f"STK Push HTTP Error: {e}", "status": "failed"}
#     except requests.exceptions.ConnectionError as e:
#         print(f"Connection Error during STK Push: {e}")
#         return {"error": f"STK Push Connection Error: {e}", "status": "failed"}
#     except requests.exceptions.Timeout as e:
#         print(f"Timeout Error during STK Push: {e}")
#         return {"error": f"STK Push Timeout Error: {e}", "status": "failed"}
#     except requests.exceptions.RequestException as e:
#         print(f"An unexpected Request Error occurred during STK Push: {e}")
#         return {"error": f"STK Push Request Error: {e}", "status": "failed"}
#     except Exception as e:
#         print(f"An unexpected error occurred in lipa_na_mpesa_online: {e}")
#         return {"error": f"Unexpected error: {e}", "status": "failed"}


import requests
import base64
import datetime
import os
import json

MPESA_AUTH_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
MPESA_STK_PUSH_URL = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

def get_access_token():
    consumer_key = os.getenv("MPESA_CONSUMER_KEY", "").strip()
    consumer_secret = os.getenv("MPESA_CONSUMER_SECRET", "").strip()

    print(f"DEBUG: Loaded MPESA_CONSUMER_KEY: {'*' * (len(consumer_key) - 5) + consumer_key[-5:] if consumer_key else 'NOT SET'}")
    print(f"DEBUG: Loaded MPESA_CONSUMER_SECRET: {'*' * (len(consumer_secret) - 5) + consumer_secret[-5:] if consumer_secret else 'NOT SET'}")

    if not consumer_key or not consumer_secret:
        print("ERROR: Missing MPESA credentials in environment.")
        return None

    try:
        response = requests.get(MPESA_AUTH_URL, auth=(consumer_key, consumer_secret))
        print(f"M-Pesa Access Token API Status Code: {response.status_code}")
        print(f"M-Pesa Access Token API Raw Response Text: {response.text}")
        response.raise_for_status()
        return response.json().get("access_token")
    except requests.exceptions.RequestException as e:
        print(f"Access Token Request Error: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"Access Token JSON Decode Error: {e}")
        return None

def lipa_na_mpesa_online(phone_number, amount):
    access_token = get_access_token()
    if not access_token:
        print("Failed to get access token. Aborting STK Push.")
        return {"error": "Failed to get access token"}

    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    business_short_code = os.getenv("MPESA_BUSINESS_SHORT_CODE")
    passkey = os.getenv("MPESA_PASS_KEY")
    callback_url = os.getenv("BASE_CALLBACK_URL") + "/api/mpesa/callback"

    if not business_short_code or not passkey or not callback_url:
        return {"error": "Missing MPESA configuration in .env"}

    try:
        business_short_code = int(business_short_code)
        amount = int(amount)
    except ValueError:
        return {"error": "Invalid shortcode or amount"}

    phone = str(phone_number)
    if phone.startswith("07") or phone.startswith("01"):
        phone = "254" + phone[1:]
    elif phone.startswith("+254"):
        phone = phone[1:]

    password = base64.b64encode(
        f"{business_short_code}{passkey}{timestamp}".encode()
    ).decode()

    payload = {
        "BusinessShortCode": business_short_code,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone,
        "PartyB": business_short_code,
        "PhoneNumber": phone,
        "CallBackURL": callback_url,
        "AccountReference": "CompanyXLTD",
        "TransactionDesc": "Payment of X",
    }

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(MPESA_STK_PUSH_URL, json=payload, headers=headers)
        print("STK Push API Status Code:", response.status_code)
        print("STK Push API Raw Response Text:", response.text)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"STK Push Request Error: {e}")
        return {"error": str(e)}
