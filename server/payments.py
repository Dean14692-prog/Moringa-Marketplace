# # # payments.py

# # from models import Payment # Assuming models are accessible
# # from mpesa_service import mpesa_service
# # from sqlalchemy.orm import sessionmaker # Or your SQLAlchemy session management

# # # Assuming you have a DB session object passed or accessible globally
# # def create_payment_record(db_session, order_id, user_id, amount, phone_number):
# #     """Creates a new payment record in the database."""
# #     new_payment = Payment(
# #         order_id=order_id,
# #         user_id=user_id,
# #         amount=amount,
# #         phone_number=phone_number,
# #         status='PENDING'
# #     )
# #     db_session.add(new_payment)
# #     db_session.commit()
# #     return new_payment

# # def update_payment_record(db_session, payment_id, **kwargs):
# #     """Updates an existing payment record."""
# #     payment = db_session.query(Payment).get(payment_id)
# #     if payment:
# #         for key, value in kwargs.items():
# #             setattr(payment, key, value)
# #         db_session.commit()
# #         return payment
# #     return None

# # def process_mpesa_payment(db_session, order_id, user_id, amount, phone_number):
# #     """
# #     Handles the end-to-end process of initiating an M-Pesa payment.
# #     """
# #     try:
# #         # 1. Create a pending payment record in your DB
# #         payment = create_payment_record(db_session, order_id, user_id, amount, phone_number)

# #         # 2. Initiate STK Push
# #         # Use a unique identifier for AccountReference, ideally your order_id or payment_id
# #         stk_response = mpesa_service.initiate_stk_push(
# #             phone_number=phone_number,
# #             amount=amount,
# #             account_reference=str(payment.id), # Use payment ID as unique reference
# #             transaction_desc=f"Payment for Order {order_id}"
# #         )

# #         # 3. Update payment record with M-Pesa response details
# #         if stk_response.get('ResponseCode') == '0':
# #             update_payment_record(
# #                 db_session,
# #                 payment.id,
# #                 mpesa_checkout_request_id=stk_response.get('CheckoutRequestID'),
# #                 merchant_request_id=stk_response.get('MerchantRequestID'),
# #                 status='PENDING_MPESA_STK' # More specific status
# #             )
# #             return {"success": True, "message": "STK Push initiated.", "data": stk_response}
# #         else:
# #             update_payment_record(
# #                 db_session,
# #                 payment.id,
# #                 status='FAILED_INITIATION',
# #                 result_code=stk_response.get('ResponseCode'),
# #                 result_desc=stk_response.get('ResponseDescription')
# #             )
# #             return {"success": False, "message": stk_response.get('ResponseDescription', 'STK Push initiation failed.'), "data": stk_response}

# #     except Exception as e:
# #         # Rollback the transaction if anything goes wrong during initiation
# #         db_session.rollback()
# #         print(f"Error in process_mpesa_payment: {e}")
# #         return {"success": False, "message": f"An internal error occurred: {e}"}

# # payments.py

# from models import Payment, db # Assuming db is accessible from models or passed in
# from mpesa_service import mpesa_service
# from sqlalchemy.orm import Session # Correct import for type hinting if needed
# import json # For parsing M-Pesa callback data
# from datetime import datetime # Import datetime for transaction_date

# def create_payment_record(db_session: Session, order_id: int, user_id: int, amount: float, phone_number: str):
#     """
#     Creates a new payment record in the database.

#     Args:
#         db_session (Session): The SQLAlchemy database session.
#         order_id (int): The ID of the associated order.
#         user_id (int): The ID of the user making the payment.
#         amount (float): The amount of the payment.
#         phone_number (str): The phone number used for the M-Pesa payment.

#     Returns:
#         Payment: The newly created Payment object.
#     """
#     new_payment = Payment(
#         order_id=order_id,
#         user_id=user_id,
#         amount=amount,
#         phone_number=phone_number,
#         status='PENDING' # Initial status
#     )
#     db_session.add(new_payment)
#     db_session.commit()
#     db_session.refresh(new_payment) # Refresh to get the generated ID
#     return new_payment

# def update_payment_record(db_session: Session, payment_id: int, **kwargs):
#     """
#     Updates an existing payment record with new details.

#     Args:
#         db_session (Session): The SQLAlchemy database session.
#         payment_id (int): The ID of the payment record to update.
#         **kwargs: Keyword arguments for the fields to update (e.g., status='COMPLETED').

#     Returns:
#         Payment or None: The updated Payment object, or None if not found.
#     """
#     payment = db_session.query(Payment).get(payment_id)
#     if payment:
#         for key, value in kwargs.items():
#             setattr(payment, key, value)
#         db_session.commit()
#         db_session.refresh(payment)
#         return payment
#     return None

# def process_mpesa_payment(db_session: Session, order_id: int, user_id: int, amount: float, phone_number: str):
#     """
#     Handles the end-to-end process of initiating an M-Pesa payment.
#     1. Creates a pending payment record.
#     2. Initiates the STK Push via M-Pesa API.
#     3. Updates the payment record with STK Push response details.

#     Args:
#         db_session (Session): The SQLAlchemy database session.
#         order_id (int): The ID of the associated order.
#         user_id (int): The ID of the user.
#         amount (float): The amount to pay.
#         phone_number (str): The customer's phone number.

#     Returns:
#         dict: A dictionary indicating success/failure and relevant data.
#     """
#     try:
#         # 1. Create a pending payment record in your DB
#         payment = create_payment_record(db_session, order_id, user_id, amount, phone_number)
#         print(f"Created payment record: {payment.id} for order {order_id}")

#         # 2. Initiate STK Push
#         # Use the payment ID as a unique account reference for traceability
#         stk_response = mpesa_service.initiate_stk_push(
#             phone_number=phone_number,
#             amount=amount,
#             account_reference=str(payment.id), # Use payment ID as unique reference
#             transaction_desc=f"Payment for Order {order_id}"
#         )

#         # 3. Update payment record with M-Pesa response details
#         # Safaricom's ResponseCode '0' indicates successful STK Push initiation (not necessarily payment completion)
#         if stk_response.get('ResponseCode') == '0':
#             update_payment_record(
#                 db_session,
#                 payment.id,
#                 mpesa_checkout_request_id=stk_response.get('CheckoutRequestID'),
#                 merchant_request_id=stk_response.get('MerchantRequestID'),
#                 status='PENDING_MPESA_STK' # More specific status indicating STK push sent
#             )
#             return {"success": True, "message": "STK Push initiated successfully. Please complete the transaction on your phone.", "data": stk_response}
#         else:
#             # If STK Push initiation itself failed
#             update_payment_record(
#                 db_session,
#                 payment.id,
#                 status='FAILED_INITIATION',
#                 result_code=stk_response.get('ResponseCode'),
#                 result_desc=stk_response.get('ResponseDescription')
#             )
#             return {"success": False, "message": stk_response.get('ResponseDescription', 'STK Push initiation failed.'), "data": stk_response}

#     except Exception as e:
#         # Rollback the transaction if anything goes wrong during initiation
#         db_session.rollback()
#         print(f"Error in process_mpesa_payment: {e}")
#         return {"success": False, "message": f"An internal error occurred during payment initiation: {e}"}

# def handle_mpesa_callback(db_session: Session, callback_data: dict):
#     """
#     Handles the M-Pesa STK Push callback from Safaricom.
#     Parses the callback data and updates the corresponding payment record.

#     Args:
#         db_session (Session): The SQLAlchemy database session.
#         callback_data (dict): The JSON payload received from M-Pesa.

#     Returns:
#         dict: A dictionary indicating success/failure of processing the callback.
#     """
#     print(f"[M-PESA CALLBACK] Received callback data: {json.dumps(callback_data, indent=2)}")

#     # Extract relevant data from the callback
#     body = callback_data.get('Body', {})
#     stk_callback = body.get('stkCallback', {})

#     merchant_request_id = stk_callback.get('MerchantRequestID')
#     checkout_request_id = stk_callback.get('CheckoutRequestID')
#     result_code = stk_callback.get('ResultCode')
#     result_desc = stk_callback.get('ResultDesc')
#     callback_metadata = stk_callback.get('CallbackMetadata', {}).get('Item', [])

#     amount = None
#     mpesa_receipt_number = None
#     transaction_date = None
#     phone_number = None

#     for item in callback_metadata:
#         if item.get('Name') == 'Amount':
#             amount = item.get('Value')
#         elif item.get('Name') == 'MpesaReceiptNumber':
#             mpesa_receipt_number = item.get('Value')
#         elif item.get('Name') == 'TransactionDate':
#             transaction_date = item.get('Value')
#         elif item.get('Name') == 'PhoneNumber':
#             phone_number = item.get('Value')

#     # Find the payment record using MerchantRequestID or CheckoutRequestID
#     # Assuming MerchantRequestID is stored and unique for pending STK pushes
#     payment = db_session.query(Payment).filter_by(
#         merchant_request_id=merchant_request_id,
#         mpesa_checkout_request_id=checkout_request_id
#     ).first()

#     if not payment:
#         print(f"[M-PESA CALLBACK ERROR] No matching payment record found for MerchantRequestID: {merchant_request_id}, CheckoutRequestID: {checkout_request_id}")
#         return {"success": False, "message": "No matching payment record found."}

#     # Update payment status based on ResultCode
#     if result_code == 0:
#         # Payment was successful
#         payment.status = 'COMPLETED'
#         payment.mpesa_receipt_number = mpesa_receipt_number
#         payment.transaction_date = transaction_date # Store as string or convert to datetime object
#         payment.result_code = result_code
#         payment.result_desc = result_desc
#         payment.amount_paid_callback = amount # Store actual amount paid from callback
#         payment.phone_number_callback = phone_number # Store actual phone number from callback
#         print(f"[M-PESA CALLBACK SUCCESS] Payment {payment.id} completed. Receipt: {mpesa_receipt_number}")
#     else:
#         # Payment failed or was cancelled
#         payment.status = 'FAILED'
#         payment.result_code = result_code
#         payment.result_desc = result_desc
#         print(f"[M-PESA CALLBACK FAILED] Payment {payment.id} failed/cancelled. ResultCode: {result_code}, Desc: {result_desc}")

#     try:
#         db_session.commit()
#         return {"success": True, "message": "M-Pesa callback processed successfully."}
#     except Exception as e:
#         db_session.rollback()
#         print(f"[M-PESA CALLBACK DB ERROR] Failed to update payment record {payment.id}: {e}")
#         return {"success": False, "message": f"Failed to update payment record: {e}"}