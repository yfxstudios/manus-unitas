'use client'

import { Button } from '@/components/ui/button'
import React from 'react'
import { createBillingPortalSession } from './billingPortal'
import { getCurrentUser } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { ExternalLink } from 'lucide-react'

const Page = () => {
  const router = useRouter()
  const clickHandler = async () => {
    const user = await getCurrentUser()
    console.log(user)
    await createBillingPortalSession({
      customerId: user.customerId
    }).then((url) => {
      router.push(url)
    })
  }
  return (
    <div className="flex p-8 justify-center items-center w-full h-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">Billing</h1>
        <p className="font-light text-gray-600">
          Manage your billing information and subscriptions.
        </p>
        <Button
          onClick={clickHandler}
          className="gap-2"
        >Open customer portal <ExternalLink /></Button>
      </div>
    </div>
  )
}

export default Page
