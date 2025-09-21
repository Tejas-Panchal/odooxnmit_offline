import stripe
import os

# --- This file abstracts all communication with the payment gateway ---

# Configure your Stripe API keys securely using environment variables
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

def create_payment_link(amount, bill_id, description):
    """
    Creates a Stripe Checkout Session to generate a hosted payment page URL.

    Args:
        amount (float): The total amount to be paid.
        bill_id (int): The ID of the vendor bill being paid.
        description (str): A description for the payment.

    Returns:
        str: The URL of the hosted payment page.
    """
    try:
        # Convert amount to cents (Stripe requires the smallest currency unit)
        amount_in_cents = int(amount * 100)

        session = stripe.checkout.Session.create(
            # Line items represent the product or service being purchased
            line_items=[{
                'price_data': {
                    'currency': 'inr',  # Or 'usd' etc.
                    'product_data': {
                        'name': 'Vendor Bill Payment',
                        'description': description,
                    },
                    'unit_amount': amount_in_cents,
                },
                'quantity': 1,
            }],
            # The mode must be 'payment' for a one-time purchase
            mode='payment',
            # URLs to redirect the user after the payment is completed or cancelled
            success_url=os.environ.get('PAYMENT_SUCCESS_URL') + f'?bill_id={bill_id}',
            cancel_url=os.environ.get('PAYMENT_CANCEL_URL'),
        )
        
        # Return the URL of the created Stripe session
        return session.url

    except stripe.error.StripeError as e:
        print(f"Stripe API error: {e}")
        raise RuntimeError("Failed to create payment link with Stripe.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        raise RuntimeError("An unexpected error occurred during payment.")