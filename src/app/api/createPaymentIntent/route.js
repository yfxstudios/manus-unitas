import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function POST(req, res) {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: true,
    });

    return new NextResponse({
      status: 200,
      body: paymentIntent,
    });
  } catch (error) {
    return new NextResponse({
      status: 500,
      body: error,
    });
  }
}