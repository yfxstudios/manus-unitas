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

    console.log("ORGANIZATION: " + data.organization)

    createUser({
      ...data,
      organizationId: getOrganization(data.organization.displayName.trim().toLowerCase().replace(/ /g, '-'))._id,
    })
    const response = await addMember(data.organization.displayName.trim().toLowerCase().replace(/ /g, '-'), data)
    return response
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
