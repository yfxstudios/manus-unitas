import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const SubscriptionCard = ({ subscription, pricing, monthPriceId, annualPriceId }) => {


  return (
    <div className="flex flex-col p-6 mx-auto max-w-lg text-center bg-base-100 rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8">
      <h3 className="mb-4 text-2xl font-semibold">{subscription.name}</h3>
      <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">{subscription.description}</p>
      {pricing === "monthly" &&
        (
          <div className="flex flex-col my-8">
            <div className="flex justify-center items-baseline">
              <span className="mr-2 text-5xl font-extrabold">${subscription.pricing.monthly}</span>
              <span className="text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <p className="text-sm  text-gray-500 dark:text-gray-400">&nbsp;</p>
          </div>
        ) || (
          <div className="flex flex-col my-8">
            <div className="justify-center items-baseline">
              <span className="mr-2 text-5xl font-extrabold">${subscription.pricing.yearly}</span>
              <span className="text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <p className="text-sm  text-gray-500 dark:text-gray-400">Billed annually</p>
          </div>
        )}
      <ul role="list" className="mb-8 space-y-4 text-left">
        {subscription.features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-3">
            <Check />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button variant={subscription.variant} asChild>
        <Link href={pricing === "monthly" ? `/checkout/${monthPriceId}` : `/checkout/${annualPriceId}`}>{subscription.action}</Link>
      </Button>
    </div>
  )
}

export default SubscriptionCard
