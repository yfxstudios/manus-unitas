'use client'

import React from 'react'

import { useState } from 'react'


import phoneNumberFormatter from '@/lib/util/phoneNumber'
import { signIn } from 'next-auth/react'

export default function VolunteerSignUp(props) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)

  const [organizationSuggestions, setOrganizationSuggestions] = useState([])



  const handleSubmit = async () => {
    const firstName = document.getElementById('first-name').value
    const lastName = document.getElementById('last-name').value
    const username = document.getElementById('username').value
    const email = document.getElementById('email').value
    const phone = document.getElementById('phone').value
    const password = document.getElementById('password').value
    const confirmPassword = document.getElementById('confirm-password').value
    const terms = document.getElementById('terms').checked

    const organization = document.getElementById('organization').value

    if (firstName === '' || lastName === '' || email === '' || phone === '' || password === '' || confirmPassword === '') {
      alert('Please fill out all fields')
      return
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (!terms) {
      alert('Please agree to the terms and conditions')
      return
    }

    if (organization === '') {
      alert('Please select an organization')
      return
    }

    // console.log(organization.trim().toLowerCase().replace(/ /g, '-'))

    if (!props.organizations.includes(organization.trim())) {
      alert('Please select an organization from the list')
      return
    }


    const response = await props.handleSubmit({
      first_name: firstName,
      last_name: lastName,
      username: username,
      email: email,
      phone: phone,
      password: password,
      organization: {
        accepted: false,
        displayName: organization,
        admin: false
      }
    })

    if (response === 'User already exists') {
      alert('User already exists')
    } else if (response === 'Username already exists') {
      alert('Username already exists')
    } else if (response === 'Organization already exists') {
      alert('Organization already exists')
    } else if (response === 'success') {
      signIn('credentials', {
        email: email,
        password: password,
        redirect: true,
        callbackUrl: '/dashboard'
      })
    } else {
      alert(response)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen" >
      <h1 className="text-4xl font-bold mb-8">Volunteer Sign Up</h1>
      <div className="flex flex-col items-center justify-center">
        <input type="text" placeholder="First Name" className="input w-96 mb-4" id='first-name' />
        <input type="text" placeholder="Last Name" className="input w-96 mb-4" id='last-name' />
        <input type="text" placeholder="Username" className="input w-96 mb-4" id='username' />
        <input type="email" placeholder="Email" className="input w-96 mb-4" id='email' />
        <input type="tel" placeholder="Phone Number" className="input w-96 mb-4" value={phoneNumber} onChange={(e) => setPhoneNumber(phoneNumberFormatter(e))} id='phone' />
        {/* <input type="text" placeholder='Password' className='input w-96 mb-4' /> */}
        <div className="relative w-96 mb-4">
          <input type="password" placeholder="Password" className="input w-full" id='password' />
        </div>
        <div className="relative w-96 mb-8">
          <input type="password" placeholder="Confirm Password" className="input w-full" id='confirm-password' />
        </div>

        <p className="text-sm mb-2">Find your organization</p>
        <input type="text" placeholder="Organization" className="input w-96" id='organization' onChange={(e) => {

          const value = e.target.value.trim().toLowerCase()

          if (value === '') {
            setOrganizationSuggestions([])
            return
          }

          const suggestions = props.organizations.filter(org => org.toLowerCase().includes(value))
          setOrganizationSuggestions(suggestions)
        }} />
        <div className="w-96 bg-white border border-gray-300 rounded mb-4">
          {organizationSuggestions.map(org => (
            <div className="p-2 border-b border-gray-300 text-sm cursor-pointer text-primary-content" key={org}
              onClick={() => {
                document.getElementById('organization').value = org.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) // replace - with space and capitalize first letter of each word

                setOrganizationSuggestions([])
              }}>{org.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())}</div>
          ))}
        </div>


        <div className="flex flex-row items-center justify-between mb-4">
          <input type="checkbox" id="terms" className="mr-2" />
          <label htmlFor="terms" className="text-sm">I agree to the Terms of Service and Privacy Policy</label>
        </div>
        <button className="btn btn-primary btn-outline w-96"
          onClick={handleSubmit}
        >Sign Up</button>
      </div>
    </div >
  )
}

