'use client'

import { loadStripe } from '@stripe/react-stripe-js'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useLayoutEffect, useState } from 'react'

const Completion = () => {
  const params = useSearchParams()
  const payment_intent = params.get('payment_intent')
  const payment_intent_client_secret = params.get('payment_intent_client_secret')
  const redirect_status = params.get('redirect_status')

  const [noRedirect, setNoRedirect] = useState(false)

  const router = useRouter()

  useLayoutEffect(() => {
    if (redirect_status === 'succeeded') {
      console.log('Redirecting to dashboard... 🎉')
      setTimeout(() => {
        console.log('Redirecting to dashboard...')
        router.push('/dashboard')
        setNoRedirect(true)
      }, 3000)
    }
    setTimeout
  }, [redirect_status])

  return (
    <div className='bg-gray-100 min-h-screen flex flex-col items-center justify-center'>
      <h1 className='text-4xl font-normal'>Success!</h1>
      <p className='text-lg font-light'>Redirecting to your dashboard...</p>

      <p className={`text-sm font-light transition-opacity ${noRedirect ? 'opacity-100' : 'opacity-0'} 
      `}>If you are not redirected, <Link href='/dashboard' className='underline'>click here</Link></p>
    </div>
  )
}

export default Completion
