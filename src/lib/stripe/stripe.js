// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
import { loadStripe } from '@stripe/stripe-js';
const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// The price ID passed from the client
//   const {priceId} = req.body;
const priceId = '{{PRICE_ID}}';

const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [
    {
      price: priceId,
      // For metered billing, do not pass quantity
      quantity: 1,
    },
  ],
  // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
  // the actual Session ID is returned in the query parameter when your customer
  // is redirected to the success page.
  success_url: 'https://example.com/success.html?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://example.com/canceled.html',
});

// Redirect to the URL returned on the Checkout Session.
// With express, you can redirect with:
//   res.redirect(303, session.url);