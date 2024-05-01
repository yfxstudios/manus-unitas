import React, { Suspense } from 'react'
import Page from './success'

export default function suspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  )
}
