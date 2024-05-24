'use server'

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
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-04-10",
    });

    const { unit_amount } = await getPrice(id)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: unit_amount,
      currency: "usd",
    });

    return paymentIntent
  } catch (error) {
    console.error(error)
  }
}