
import Stripe from 'stripe';
import mongoose from 'mongoose';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

mongoose.connect(process.env.MONGODB_URI + 'manus-unitas');

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
}
);

mongoose.connection.on('error', (err) => {
  console.error(err);
}
);

const { Schema } = mongoose;

const subscriptionSchema = new Schema({
  subscriptionId: String,
  customerId: String,
  priceId: String,
  status: String,
  quantity: Number,
  startDate: Date,
  endDate: Date,
  trialStartDate: Date,
  trialEndDate: Date,
  createdAt: Date,
  updatedAt: Date,
});

let Subscription;
if (!mongoose.models.Subscription) {
  Subscription = mongoose.model('Subscription', subscriptionSchema);
}

export async function POST(req) {
  try {
    const item = await req.json();

    // check if item exists (id and secretID match)

    console.log(item)

    let orderAmount = item.price

    if (item.price > 1500) {
      orderAmount = Math.round(item.price * 103) / 100
    }

    

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerID,
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
      success_url: `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://manusunitas.com'}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://manusunitas.com'}/subscription`,
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