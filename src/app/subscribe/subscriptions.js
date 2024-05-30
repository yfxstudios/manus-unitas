'use client'

import React from 'react'
import TransitionLink from '@/app/components/TransitionLink'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import Stripe from 'stripe'
import SubscriptionCard from './subscriptionCard'

export default function Subscriptions() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-04-10',
  });


  const [pricing, setPricing] = React.useState("monthly")
  return (
    <div className="min-h-screen flex flex-col w-full p-10 items-center justify-center">
      <h1 className="text-4xl font-bold text-center max-w-md">{`Choose the plan that's right for you`}</h1>

      <section className="w-full">
        <div className="py-12 px-4 mx-auto max-w-screen-xl lg:px-6">
          <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <div className="flex justify-center items-center space-x-4">
              <label htmlFor="toggle" className="text-gray-500 dark:text-gray-400">Monthly</label>
              {/* <input type="checkbox" className="toggle toggle-lg" onChange={(e) => {
                setPricing(e.target.checked ? "yearly" : "monthly")
              }} /> */}
              <Switch
                checked={pricing === "yearly"}
                onCheckedChange={(checked) => {
                  setPricing(checked ? "yearly" : "monthly")
                }}
              />
              <label htmlFor="toggle" className="text-gray-500 dark:text-gray-400">Yearly (20% off)</label>
            </div>
          </div>

          <div className='flex flex-col space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0'>
            <SubscriptionCard pricing={pricing}
              monthPriceId="price_1PJMm8RpYIAAAWYMtssSHc8q"
              annualPriceId="price_1PJMmVRpYIAAAWYMLUHHfeFn"
              subscription={
                {
                  name: "Starter",
                  description: "Best option for small nonprofits and organizations.",
                  pricing: {
                    monthly: 15,
                    yearly: 12
                  },
                  features: [
                    "Up to 100 volunteers",
                    "Basic features",
                    "Email support",
                    "Basic reporting"
                  ],
                  action: "Get started",
                  variant: ""
                }
              } />
            <SubscriptionCard pricing={pricing} subscription={
              {
                name: "Pro",
                description: "Best option for medium-sized nonprofits and organizations.",
                pricing: {
                  monthly: 25,
                  yearly: 20
                },
                features: [
                  "Up to 500 volunteers",
                  "Advanced features",
                  "Email and chat support",
                  "Advanced reporting"
                ],
                action: "Coming Soon",
                variant: "ghost"
              }
            } />
            <SubscriptionCard pricing={pricing} subscription={
              {
                name: "Enterprise",
                description: "Best option for large nonprofits and organizations.",
                pricing: {
                  monthly: 50,
                  yearly: 40
                },
                features: [
                  "Unlimited volunteers",
                  "All features",
                  "Priority support",
                  "Custom reporting"
                ],
                action: "Coming Soon",
                variant: "ghost"
              }
            } />
          </div>
        </div>
      </section>

    </div>
  )
}
