import React from 'react'
import VolunteerSignUp from './signup'
import { getOrganization, getOrganizations } from '@/lib/mongo/organization'
import { createUser, getUsers } from '@/lib/mongo/users'
import Organization from '@/lib/schemas/organizationSchema'


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

    const organization = await Organization.findOne({ databaseName: data.organization.displayName.trim().toLowerCase().replace(/ /g, '-') })

    createUser({
      ...data,
      organizationId: organization._id,
    })

    return "success"
  }
  // need list of organization displayName

  const organizations = await Organization.find()

  const orgs = organizations.map(org => org.displayName)




  return (
    <VolunteerSignUp handleSubmit={handleSubmit} organizations={orgs} />
  )
}
