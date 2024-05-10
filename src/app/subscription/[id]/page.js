'use client'
import React from 'react'
// import { getServerSession } from 'next-auth/next'
// import { options } from '@/app/api/auth/[...nextauth]/options'
import { loadStripe } from '@stripe/stripe-js'

import verifySignIn from '@/app/verifySignIn'



export default async function page({ params }) {
  // const session = await getServerSession(options)


  // if (!session) {
  // return (
  //   <div className="flex items-center justify-center h-screen">
  //     <h1 className="text-3xl">You need to be logged in to view this page</h1>
  //   </div>
  // )


  if (verifySignIn() === false) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl">You need to be logged in to view this page</h1>
      </div>
    )
  }


  const checkout = async (item) => {

    const response = await fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.manusunitas.com'}/api/paybill`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    }).then(res => res.json())

    if (response.statusCode === 500) {
      console.error(response.message)
      return
    }

    if (response.statusCode === 400) {
      console.error(response.message)
      return
    }

    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

    const { error } = await stripe.redirectToCheckout({
      sessionId: response.id
    })

  }



  if (params.id === "15") {
    // Starter monthly subscription

    const item = {
      priceID: "price_1PCw8uRpYIAAAWYMsVwOWQJU",
      name: "Starter",
      description: "Best option for small nonprofits and organizations."
    }

    checkout(item)
  } else if (params.id === "12") {
    // Starter annual subscription
    const item = {
      priceID: "price_1PCw9XRpYIAAAWYMUiZNahtg",
      name: "Starter",
      description: "Best option for small nonprofits and organizations."
    }

    checkout(item)
  }

  else {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl">Subscription not found. Please try again.</h1>
      </div>
    )
  }
}
