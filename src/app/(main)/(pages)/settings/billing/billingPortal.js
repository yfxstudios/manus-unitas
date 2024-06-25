'use server'

import Stripe from "stripe"

export async function createBillingPortalSession({ customerId }) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: "http://localhost:3000/settings/billing",
  })

  return session.url
}