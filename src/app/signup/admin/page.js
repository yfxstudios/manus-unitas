import React from 'react'
import AdminSignUp from './adminSignUp'
import { getOrganization } from '@/lib/mongo/organization'
import { createUser, getUsers } from '@/lib/mongo/users'


export default async function Page() {
  const handleSubmit = async (data) => {
    'use server'
    // console.log(data)
    const users = await getUsers()

    if (users.find(user => user.email === data.email)) {
      return "User already exists"
    } else if (users.find(user => user.username === data.username)) {
      return "Username already exists"
    }

    const response = await createUser({
      ...data,
      completedSignup: false,
      completedTutorial: false,
      accepted: 1,
      organizationId: null,
      admin: true
    })
    return response
  }




  return (
    <AdminSignUp handleSubmit={handleSubmit} />
  )
}
