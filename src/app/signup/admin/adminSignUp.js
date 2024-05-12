'use client'

import React from 'react'

import { useState } from 'react'

import phoneNumberFormatter from '@/lib/util/phoneNumber'
import { Visibility, VisibilityOff } from '@mui/icons-material'


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

    const response = await props.handleSubmit({
      first_name: firstName,
      last_name: lastName,
      username: username,
      email: email,
      phone: phone,
      password: password,
      organization: {
        accepted: false,
        displayName: null,
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
        callbackUrl: '/organization-details'
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen" >
      <h1 className="text-4xl font-bold mb-8">Administrator Sign Up</h1>
      <a href="/signup" className="underline mb-8">Sign up as a volunteer</a>
      <div className="flex flex-col items-center justify-center">
        <input type="text" placeholder="First Name" className="input w-96 mb-4" id='first-name' />
        <input type="text" placeholder="Last Name" className="input w-96 mb-4" id='last-name' />
        <input type="text" placeholder="Username" className="input w-96 mb-4" id='username' />
        <input type="email" placeholder="Email" className="input w-96 mb-4" id='email' />
        <input type="tel" placeholder="Phone Number" className="input w-96 mb-4" value={phoneNumber} onChange={(e) => setPhoneNumber(phoneNumberFormatter(e))} id='phone' />
        {/* <input type="text" placeholder='Password' className='input w-96 mb-4' /> */}
        <div className="relative w-96 mb-4">
          <input type={passwordVisible ? 'text' : 'password'} placeholder="Password" className="input w-full" id='password' />
          <button className="absolute right-2 top-[50%] transform -translate-y-1/2" onClick={() => setPasswordVisible(!passwordVisible)}>
            {passwordVisible ? <VisibilityOff /> : <Visibility />}
          </button>
        </div>
        <div className="relative w-96 mb-8">
          <input type={passwordVisible ? 'text' : 'password'} placeholder="Confirm Password" className="input w-full" id='confirm-password' />
          <button className="absolute right-2 top-[50%] transform -translate-y-1/2" onClick={() => setPasswordVisible(!passwordVisible)}>
            {passwordVisible ? <VisibilityOff /> : <Visibility />}
          </button>
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

