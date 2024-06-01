'use server'

import Organization from "@/lib/schemas/organizationSchema";
import Users from "@/lib/schemas/userSchema";
import { getServerSession } from "next-auth";
import Stripe from "stripe"


export async function getPrice(id) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-04-10",
    });

    const price = await stripe.prices.retrieve(id)

    const product = await stripe.products.retrieve(price.product)

    price.name = product.name
    price.description = product.description

    return price
  } catch (error) {
    console.error(error)
  }
}

export async function createPaymentIntent(id) {
  try {
    const session = await getServerSession()
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-04-10",
    });

    const { unit_amount } = await getPrice(id)


    const customer = await Users.findOne({ email: session.user.email })



    const subscription = await stripe.subscriptions.create({
      customer: customer.customerId,
      items: [{
        price: id,
      }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: 'on_subscription'
      },
      expand: ['latest_invoice.payment_intent'],
      currency: 'usd',
      metadata: {
        organizationId: customer.organizationId.toString()
      }
    });

    const paymentIntent = subscription.latest_invoice.payment_intent



    return paymentIntent
  } catch (error) {
    console.error(error)
  }
}