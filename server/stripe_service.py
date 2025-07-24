import stripe
from config import STRIPE_SECRET_KEY

stripe.api_key = STRIPE_SECRET_KEY

def create_stripe_session(email, amount):
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{
            "price_data": {
                "currency": "kes",
                "product_data": {"name": "Moringa Purchase"},
                "unit_amount": int(amount * 100),
            },
            "quantity": 1,
        }],
        mode="payment",
        customer_email=email,
        success_url="http://localhost:5173/payment-success",
        cancel_url="http://localhost:5173/payment-cancel",
    )
    return session.url
