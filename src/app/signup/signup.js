'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import TransitionLink from '../components/TransitionLink'

export default function SignUp() {
  const router = useRouter()



  //   Signup Options:

  // Offer clear and prominent signup options for both volunteers and nonprofits.
  // Use contrasting colors or icons to differentiate between the two signup paths.
  // Volunteer Signup Process:

  // Start with a simple signup form asking for basic information such as name, email address, and password.
  //     Optionally, allow volunteers to sign up using their social media accounts for added convenience.
  // Prompt volunteers to complete their profiles by providing additional details such as skills, interests, availability, and preferred causes or organizations to volunteer with.
  // Guide volunteers through an optional tour or tutorial highlighting key features and how to use them effectively.
  // Nonprofit Signup Process:

  // Request essential information from nonprofits such as organization name, contact person, email address, and organization type(e.g., 501(c)(3)).
  // Ask nonprofits to provide details about their volunteer opportunities, including the types of roles available, time commitments, and preferred skills or qualifications.
  // Offer the option for nonprofits to upload their logo and provide a brief description of their mission and activities.
  // Guide nonprofits through setting up their volunteer opportunities, including event creation, scheduling, and volunteer management features.
  // Confirmation and Verification:

  // Send a verification email to both volunteers and nonprofits to confirm their registration and activate their accounts.
  // Include clear instructions and a link to verify their email addresses to complete the signup process.

  return (
    <div className="flex flex-row items-center justify-center min-h-screen py-2">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h1 className="text-3xl font-bold text-center mb-8 text-primary-content">Sign Up</h1>
          <div className="mb-4">
            <button className="btn btn-primary w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              <TransitionLink href="/volunteer-signup">Volunteer Sign Up</TransitionLink>
            </button>
            <button className="btn btn-secondary w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">
              <TransitionLink href="/nonprofit-signup">Nonprofit Sign Up</TransitionLink>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}