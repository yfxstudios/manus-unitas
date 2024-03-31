import React from 'react'
import Form from './Form'

import { createOrganization } from '@/lib/mongo/organization'
import { createUser, getUsers } from '@/lib/mongo/users'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { options } from '../api/auth/[...nextauth]/options'

// Nonprofit Signup Process:

// Request essential information from nonprofits such as organization name, contact person, email address, and organization type(e.g., 501(c)(3)).
// Ask nonprofits to provide details about their volunteer opportunities, including the types of roles available, time commitments, and preferred skills or qualifications.
// Offer the option for nonprofits to upload their logo and provide a brief description of their mission and activities.
// Guide nonprofits through setting up their volunteer opportunities, including event creation, scheduling, and volunteer management features.



export default function OrgSignUp() {
  const session = getServerSession(options)

  if (session.user) {
    redirect('/dashboard')
  }

  
  const handleSubmit = async (formData) => {
    'use server'

    console.log('submit')

    const { organization, contactPhone, adminEmail, username, firstName, lastName, adminPhone, password, confirmPassword, type, description, terms } = formData


    if (organization === '' || contactPhone === '' || adminEmail === '' || username === '' || firstName === '' || lastName === '' || adminPhone === '' || password === '' || confirmPassword === '' || type === '' || description === '') {
      alert('Please fill out all fields')
      console.log('Fill out all fields')
      return
    }

    if (password !== confirmPassword) {
      console.log('password', password)
      console.log('confirmPassword', confirmPassword)
      return
    }

    if (!terms) {
      alert('Please agree to the terms and conditions')
      console.log('terms', terms)
      return
    }

    const users = await getUsers()

    if (users.find(user => user.email === adminEmail)) {
      console.log('User already exists')
      // throw new Error('User already exists')
      return "User already exists"
    } else if (users.find(user => user.username === username)) {
      console.log('Username already exists')
      // throw new Error('Username already exists')
      return "Username already exists"
    }

    try {
      const res = await createOrganization({
        displayName: organization,
        databaseName: organization.toLowerCase().replace(/ /g, '-'),
        type: type.toLowerCase(),
        description: description,
        contactPhone: contactPhone,
      }, {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: adminEmail,
        phone: adminPhone,
        admin: true
      })


      if (res === 'Organization already exists') {
        console.log('Organization already exists')
        return "Organization already exists"
      }

      await createUser({
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: adminEmail,
        phone: adminPhone,
        password: password,
        organization: {
          accepted: true,
          displayName: organization,
          databaseName: organization.toLowerCase().replace(/ /g, '-'),
          admin: true
        }
      })


      console.log('Organization created')
      return "success"
    } catch (error) {
      console.error(error)
    }
  }


  return (
    <Form handleSubmit={handleSubmit} />
  )
}
