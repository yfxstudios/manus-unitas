'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import React from 'react'

const Layout = ({ children }) => {
  const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}`)

  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  )
}

export default Layout
