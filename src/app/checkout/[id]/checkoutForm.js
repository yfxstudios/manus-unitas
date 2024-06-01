'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Skeleton } from '@/components/ui/skeleton'


import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'


// import {}

const Checkout = (props) => {
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = React.useState('')
  const [isProcessing, setIsProcessing] = React.useState(false)


  const pathname = usePathname()
  const id = pathname.split('/')[2]
  // console.log(id)

  const { data, error, isFetched } = props

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    elements.submit()

    const { error } = await stripe.confirmPayment({
      clientSecret: props.clientSecret,
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/completion`,
      },
    })

    if (error) {
      setMessage(error.message)
    }

    setIsProcessing(false)
  }


  return (
    <div className='bg-gray-100 min-h-screen flex flex-col items-center justify-center lg:flex-row' >
      <div className='w-screen h-3/4 lg:h-screen lg:w-1/2 flex flex-col bg-primary text-primary-foreground p-16 rounded-b-xl lg:rounded-none lg:rounded-r-xl shadow-lg justify-center gap-4'>
        <Link href="/subscribe" passHref>
          <div className='flex flex-row items-center gap-3 mb-4 cursor-pointer transition-opacity hover:opacity-75'>
            <ArrowLeft />
            <div className='rounded-full bg-primary-foreground p-1'>
              <Image className='h-4 w-4' width={128} height={128} src='/logo.svg' alt='logo' />
            </div>
            <p>Manus Unitas</p>
          </div>
        </Link>
        {error && (
          <div>
            <X className='h-96 w-96' />
            <h1 className='text-2xl font-semibold'>An error occurred</h1>
            <p className='text-sm'>Please try again later</p>
          </div>
        )}
        {!isFetched && !error ? (
          <>
            <Skeleton className='h-6 w-2/3 rounded-lg mb-3' />
            <Skeleton className='h-24 w-full rounded-xl' />
            <Skeleton className='h-4 w-full rounded-lg' />

          </>
        ) : (
          <div>
            <div className='flex flex-row items-center gap-3 mb-5'>
              <h1 className='text-5xl font-light'>${
                (data.unit_amount / 100).toFixed(2)
              }</h1>
              <p className='text-sm'>/ {data.recurring.interval}</p>
            </div>
            <div className='flex flex-col p-4 gap-2 rounded-xl bg-black/20'>
              <h1 className='text-2xl font-semibold'>{data.name}</h1>
              <p className='mb-1'>{data.description}</p>
            </div>
            <div className='flex flex-row justify-between py-6 px-4'>
              <p className='text-sm'>Total due today</p>
              <p className='text-sm font-bold'>${
                (data.unit_amount / 100).toFixed(2)
              }</p>
            </div>

          </div>
        )}
      </div>

      <div className='w-screen h-3/4 lg:h-screen lg:w-1/2 bg-primary-foreground flex flex-col items-center justify-center p-16'>
        <form id="payment-form" onSubmit={handleSubmit} className='w-full max-w-lg'>
          <PaymentElement />
          <Button
            type='submit'
            disabled={isProcessing}
            className='w-full mt-4'
          >
            {isProcessing ? 'Processing...' : 'Pay'}
          </Button>
        </form>
      </div>
    </div >
  )
}

export default Checkout
