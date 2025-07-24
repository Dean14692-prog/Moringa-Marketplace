# payments.py

from models import Payment # Assuming models are accessible
from mpesa_service import mpesa_service
from sqlalchemy.orm import sessionmaker # Or your SQLAlchemy session management

# Assuming you have a DB session object passed or accessible globally
def create_payment_record(db_session, order_id, user_id, amount, phone_number):
    """Creates a new payment record in the database."""
    new_payment = Payment(
        order_id=order_id,
        user_id=user_id,
        amount=amount,
        phone_number=phone_number,
        status='PENDING'
    )
    db_session.add(new_payment)
    db_session.commit()
    return new_payment

def update_payment_record(db_session, payment_id, **kwargs):
    """Updates an existing payment record."""
    payment = db_session.query(Payment).get(payment_id)
    if payment:
        for key, value in kwargs.items():
            setattr(payment, key, value)
        db_session.commit()
        return payment
    return None

def process_mpesa_payment(db_session, order_id, user_id, amount, phone_number):
    """
    Handles the end-to-end process of initiating an M-Pesa payment.
    """
    try:
        # 1. Create a pending payment record in your DB
        payment = create_payment_record(db_session, order_id, user_id, amount, phone_number)

        # 2. Initiate STK Push
        # Use a unique identifier for AccountReference, ideally your order_id or payment_id
        stk_response = mpesa_service.initiate_stk_push(
            phone_number=phone_number,
            amount=amount,
            account_reference=str(payment.id), # Use payment ID as unique reference
            transaction_desc=f"Payment for Order {order_id}"
        )

        # 3. Update payment record with M-Pesa response details
        if stk_response.get('ResponseCode') == '0':
            update_payment_record(
                db_session,
                payment.id,
                mpesa_checkout_request_id=stk_response.get('CheckoutRequestID'),
                merchant_request_id=stk_response.get('MerchantRequestID'),
                status='PENDING_MPESA_STK' # More specific status
            )
            return {"success": True, "message": "STK Push initiated.", "data": stk_response}
        else:
            update_payment_record(
                db_session,
                payment.id,
                status='FAILED_INITIATION',
                result_code=stk_response.get('ResponseCode'),
                result_desc=stk_response.get('ResponseDescription')
            )
            return {"success": False, "message": stk_response.get('ResponseDescription', 'STK Push initiation failed.'), "data": stk_response}

    except Exception as e:
        # Rollback the transaction if anything goes wrong during initiation
        db_session.rollback()
        print(f"Error in process_mpesa_payment: {e}")
        return {"success": False, "message": f"An internal error occurred: {e}"}