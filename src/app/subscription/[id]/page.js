import React from 'react'
import { getServerSession } from 'next-auth/next'
import { options } from '@/app/api/auth/[...nextauth]/options'
import { redirect } from 'next/navigation'

export default async function page({ params }) {
  const session = await getServerSession(options)

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl">You need to be logged in to view this page</h1>
      </div>
    )
  }


  if (params.id === "15") {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6">
        <p className="text-3xl">You are paying ${params.id}/month</p>
        <p className="text-xl"> Save 10% by <a href="/subscription/12" className='underline'>paying yearly</a></p>
        <button className="btn btn-primary">Subscribe</button>
      </div>
    )
  } else if (params.id === "12") {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6">
        <p className="text-2xl">You are paying ${params.id}/month</p>
        <p className='text-xl'>Billed yearly at ${params.id * 12}</p>
        <button className="btn btn-primary">Subscribe</button>
      </div>
    )
  }

  else {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl">Subscription not found. Please try again.</h1>
      </div>
    )
  }
}
