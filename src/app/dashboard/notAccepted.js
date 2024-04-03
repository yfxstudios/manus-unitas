'use client'

import React from 'react'
import { signOut } from 'next-auth/react'


export default function NotAccepted(props) {
  const handleLogout = async () => {
    await signOut()
    props.handleLogout()
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl">You have not been accepted into your organization yet. <br />Please wait for an admin to accept your request. <br />
        <span className="text-sm">Username: {props.user.username}</span>
      </h1>
      <button className="btn btn-primary btn-outline mt-4 absolute bottom-4" onClick={handleLogout}>Logout</button>
    </div>
  )
}
