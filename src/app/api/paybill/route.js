
import Stripe from 'stripe';
import mongoose from 'mongoose';

import User from '@/lib/schemas/userSchema';
import { getServerSession } from 'next-auth';
import { options } from '../auth/[...nextauth]/options';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

// mongoose.connect(process.env.MONGODB_URI)

export async function POST(req) {
  const session = await getServerSession(options)
  const user = await session.user

  try {
    const item = await req.json();

    const customer = await User.findOne({ email: user.email }).lean()


    let orderAmount = item.price

    if (item.price > 1500) {
      orderAmount = Math.round(item.price * 103) / 100
    }



    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer.customerId.toString(),
      line_items: [
        {
          price: item.priceID,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url: `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.manusunitas.com'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.manusunitas.com'}/subscribe`,
    });

    return new Response(JSON.stringify(checkoutSession), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch
  (err) {
    // console.error(err);
    const errorMessage = err instanceof Error ? err.message : 'An error occurred';
    return new Response(JSON.stringify({ statusCode: 500, message: errorMessage }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}