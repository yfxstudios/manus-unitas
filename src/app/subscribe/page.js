import React from 'react'
import Subscriptions from './subscriptions'
import { createDropdownMenuScope } from '@radix-ui/react-dropdown-menu';
import Stripe from 'stripe';
import Plan from '@/lib/schemas/planSchema';

const Subscribe = async () => {
  const plans = await Plan.find({}).lean()
  return (
    <div>
      <Subscriptions />
    </div>
  )
}

export default Subscribe
