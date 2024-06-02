'use server'

import Events from "@/lib/schemas/eventSchema";
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

export async function getCurrentUser() {
  try {
    const session = await getServerSession()

    const user = await Users.findOne({ email: session.user.email }).lean()
    return user
  }
  catch (error) {
    console.error(error)
  }

}

export async function getEvents() {
  const session = await getServerSession()
  const user = await Users.findOne({ email: session.user.email }, { organizationId: 1 }).lean()
  const events = await Events.find({ organizationId: user.organizationId }).populate('volunteers').sort({ date: 1, startTime: 1 }).lean()

  return events
}

export async function getUsers() {
  const session = await getServerSession()
  const user = await Users.findOne({ email: session.user.email }, { organizationId: 1 }).lean()
  const users = await Users.find({ organizationId: user.organizationId }).lean()

  return users
}

export async function getEvent(id) {
  const event = await Events.findById(id).populate('volunteers').lean()
  console.log(event)
  return event
}

export async function handleAccept(id) {
  const session = await getServerSession()
  const user = await Users.findOne({ email: session.user.email }).lean()
  const event = await Events.findById(id)

  if (event.rejected.includes(user._id)) {
    event.rejected.pull(user._id)
  }

  if (!event.accepted.includes(user._id)) {
    event.accepted.push(user._id)
  }

  await event.save()
}

export async function handleDecline(id) {
  const session = await getServerSession()
  const user = await Users.findOne({ email: session.user.email }).lean()
  const event = await Events.findById(id)

  if (event.accepted.includes(user._id)) {
    event.accepted.pull(user._id)
  }

  if (!event.rejected.includes(user._id)) {
    event.rejected.push(user._id)
  }

  await event.save()
}