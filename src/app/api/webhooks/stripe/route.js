import Stripe from "stripe";
import { headers } from 'next/headers'

import { buffer } from "node:stream/consumers"

import mongoose from "mongoose";
import Subscription from "@/lib/schemas/subscriptionSchema";



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});


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
    case "customer.subscription.deleted":
      throw new Error("Not implemented")
      break
    case "customer.subscription.created":
      const session = event.data.object


      if (await Subscription.findOne({ customer: session.items.data[0].subscription }).updatedAt > session.created) {
        console.log("newer subscription already exists")
        break
      } else {
        const newSubscription = new Subscription({
          subscriptionId: session.items.data[0].subscription,
          productId: session.items.data[0].price.product,
          customerId: session.customer,
          organizationId: session.metadata.organizationId,
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
      }
    case "customer.subscription.updated":
      const updatedSession = event.data.object
      let updatedSubscription = await Subscription.findOne({ subscriptionId: updatedSession.items.data[0].subscription })

      if (!updatedSubscription) {
        // refresh subscription data
        mongoose.connection.close()
        mongoose.connect(process.env.MONGODB_URI + 'manus-unitas')
        updatedSubscription = await Subscription.findOne({ subscriptionId: updatedSession.items.data[0].subscription })
      }

      updatedSubscription.status = updatedSession.status

      await updatedSubscription.save().then(() => {
        console.log('Subscription updated')
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

