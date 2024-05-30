import React, { Suspense } from 'react'
import Completion from './completion'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Completion />
    </Suspense>
  )
}

export default page
