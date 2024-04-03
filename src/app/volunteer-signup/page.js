import React from 'react'
import VolunteerSignUp from './signup'
import { addMember, getOrganization, getOrganizations } from '@lib/mongo/organization'
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

    createUser({
      ...data,
      organization: {
        admin: false,
        accepted: false,
        declined: false,
        databaseName: data.organization.displayName.trim().toLowerCase().replace(/ /g, '-'),
        displayName: data.organization.displayName
      }
    })
    addMember(data.organization.displayName.trim().toLowerCase().replace(/ /g, '-'), data)
    return "Success"
  }

  const organizations = await getOrganizations()

  const handleGetOrg = async (org) => {
    'use server'
    const organization = await getOrganization(org)
    return organization
  }




  return (
    <VolunteerSignUp handleSubmit={handleSubmit} organizations={organizations} getOrganization={handleGetOrg} />
  )
}
