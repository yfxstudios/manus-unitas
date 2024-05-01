'use client'

import React from 'react'

import { useSearchParams } from 'next/navigation'


export default function Page() {

  const searchParams = useSearchParams()

  const sessionId = searchParams.get('session_id')

  return (
    <div>
      <h1>Subscription Success</h1>
      <p>Your subscription was successful. Thank you for your support!</p>
      {sessionId && <p>Session ID: {sessionId}</p>}
    </div>
  )
}
