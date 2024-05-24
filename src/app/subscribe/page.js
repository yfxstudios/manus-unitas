import React from 'react'
import Subscriptions from './subscriptions'
import { createDropdownMenuScope } from '@radix-ui/react-dropdown-menu';
import Stripe from 'stripe';

const Subscribe = async () => {
  return (
    <div>
      <Subscriptions />
    </div>
  )
}

export default Subscribe
