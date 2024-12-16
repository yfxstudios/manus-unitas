'use client'

import { createPaymentIntent, getPrice } from '@/app/actions'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Checkout from './checkoutForm'
import { Loader2 } from 'lucide-react'

const Layout = ({ children }) => {
  const [stripePromise, setStripePromise] = useState(null)
  const [clientSecret, setClientSecret] = useState(null)

  const pathname = usePathname()
  const id = pathname.split('/')[2]


  const { data: paymentIntent, error: paymentError, isFetched: paymentFetched } = useQuery({
    queryKey: ['paymentIntent', id],
    queryFn: () => {
      return createPaymentIntent(id)
    }
  })

  const { data, error, isFetched } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getPrice(id)
  })



  useEffect(() => {
    if (paymentIntent && paymentFetched && !paymentError) {
      setClientSecret(paymentIntent.client_secret)
    }
  }, [paymentIntent, paymentFetched, paymentError])

  useEffect(() => {
    setStripePromise(loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`))
  }, [])


  return (
    <>
      {stripePromise && clientSecret && isFetched ? (
        <Elements stripe={stripePromise} options={{
          clientSecret: clientSecret,
        }}>
          <Checkout clientSecret={clientSecret} data={data} error={error} isFetched={isFetched} />
        </Elements >
      ) : (
        <div className='bg-primary min-h-screen flex flex-col items-center justify-center text-primary-foreground'>
          <Loader2 className='h-40 w-40 animate-spin' />
          <p className='text-2xl font-light'>Loading...</p>
        </div>
      )}
    </>
  )
}

export default Layout
