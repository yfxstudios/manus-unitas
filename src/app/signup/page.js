import React from 'react'
import SignUp from './signup'
import { options } from '../api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default function page() {
  const session = getServerSession(options)

  if (session.user) {
    redirect('/dashboard')
  }

  return (
    <SignUp />
  )
}
