// const stripe = require('stripe')('sk_test_...');
// const express = require('express');
// const app = express();


// // This is your Stripe CLI webhook secret for testing your endpoint locally.
// const endpointSecret = "whsec_ac5579b5e1ca50c307a956910b79b0aa7057e51c5593e4e6a8df379c45a284ea";

// app.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
//   const sig = request.headers['stripe-signature'];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//   } catch (err) {
//     response.status(400).send(`Webhook Error: ${err.message}`);
//     return;
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntentSucceeded = event.data.object;
//       // Then define and call a function to handle the event payment_intent.succeeded
//       break;
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   response.send();
// });

// app.listen(4242, () => console.log('Running on port 4242'));
import Stripe from "stripe";
import { headers } from 'next/headers'


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature")

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    console.error(`⚠️ Error message: ${error.message}`)
    return new Response(`Webhook Error: ${error.message}`, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  // res.send();
  return new Response(null, { status: 200 });
}

