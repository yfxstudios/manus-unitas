import Stripe from "stripe";
import { headers } from 'next/headers'

import { buffer } from "node:stream/consumers"

import mongoose from "mongoose";



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

mongoose.disconnect().then(() => {
  mongoose.connect(process.env.MONGODB_URI + 'manus-unitas')
})

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB')
})

mongoose.connection.on('error', (err) => {
  console.error(err)
})


const { Schema } = mongoose

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
  updatedAt: Date
})

//  ⨯ OverwriteModelError: Cannot overwrite `Subscription` model once compiled.

let Subscription
if (!mongoose.models.Subscription) {
  Subscription = mongoose.model('Subscription', subscriptionSchema)
} else {
  Subscription = mongoose.models.Subscription
}



export async function POST(req) {
  const body = await buffer(req.body)
  const signature = headers().get("stripe-signature")

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
    case "subscription_schedule.canceled":
      throw new Error("Not implemented yet")
      break;
    case "customer.subscription.created":
      const session = event.data.object

      const newSubscription = new Subscription({
        subscriptionId: session.subscription,
        customerId: session.customer,
        priceId: session.items.data[0].price.id,
        status: session.status,
        startDate: new Date(session.current_period_start * 1000),
        endDate: new Date(session.current_period_end * 1000),
        trialStartDate: new Date(session.trial_start * 1000),
        trialEndDate: new Date(session.trial_end * 1000),
        createdAt: new Date(session.created * 1000),
        updatedAt: new Date(session.created * 1000)
      })

      await newSubscription.save().then(() => {
        console.log('Subscription saved')
      }).catch((err) => {
        console.error(err)
      })
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }


  // Return a 200 response to acknowledge receipt of the event
  // res.send();

  return new Response(null, { status: 200 });
}

