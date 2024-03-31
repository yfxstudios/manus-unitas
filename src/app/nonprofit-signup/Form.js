'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import { useState } from 'react'

import phoneNumberFormatter from '@lib/util/phoneNumber'

export default function Form(props) {
  const [adminPhoneNumber, setAdminPhoneNumber] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1
        className="text-3xl font-bold text-center mb-8 text-primary"
      >Nonprofit Sign Up</h1>
      <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={props.handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="organization">Organization Name</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-base-content leading-tight focus:outline-none focus:shadow-outline" id="organization" type="text" placeholder="Organization Name" />
        </div>
        <div className="mb-4">
          <p className="text-gray-700 text-sm font-bold mb-2"></p>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact">Organization Phone Number</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-base-content leading-tight focus:outline-none focus:shadow-outline" id="phone" type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(phoneNumberFormatter(e))} />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">Organization Type</label>
          <select className="shadow appearance-none border rounded w-full py-2 px-3 text-base-content leading-tight focus:outline-none focus:shadow-outline" id="type">
            <option value="Nonprofit">Nonprofit</option>
            <option value="501(c)(3)">501(c)(3)</option>
            <option value="NGO">NGO</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Mission and Activities</label>
          <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-base-content leading-tight focus:outline-none focus:shadow-outline" id="description" placeholder="Brief Description" style={{ resize: "none", height: 150 }}></textarea>
        </div>
        <div>

          <div className="mb-4">
            <p className="text-gray-500 text-m font-bold mb-2">Admin Account Information</p>

            <div className='mb-4 flex flex-row items-center justify-between'>
              <div>
                <label className='block text-gray-700 text-sm font-bold mb-2'>First Name</label>
                <input className='shadow appearance-none border rounded w-[100%] py-2 px-3 text-base-content leading-tight focus:outline-none focus:shadow-outline' id='first-name' type='text' placeholder='First Name' />
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-bold mb-2'>Last Name</label>
                <input className='shadow appearance-none border rounded w-[100%] py-2 px-3 text-base-content leading-tight focus:outline-none focus:shadow-outline' id='last-name' type='text' placeholder='Last Name' />
              </div>
            </div>

            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email Address</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-base-content leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email Address" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-base-content leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">Phone Number</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-base-content leading-tight focus:outline-none focus:shadow-outline" id="admin-phone" type="text" placeholder="Phone Number" value={adminPhoneNumber} onChange={(e) => setAdminPhoneNumber(phoneNumberFormatter(e))} />

          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-base-content leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm">Confirm Password</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-base-content leading-tight focus:outline-none focus:shadow-outline" id="confirm" type="password" placeholder="Confirm Password" />
          </div>
          <input type="hidden" id="test" />
        </div>
        <input type="checkbox" id="terms" name="terms" value="terms" className='mr-2 mb-4' />
        <label htmlFor="terms" className='text-sm'>I agree to the terms and conditions</label>
        <div className="flex items-center justify-between">
          <button className="btn btn-primary w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={async () => {
            const organization = document.getElementById('organization').value
            const contactPhone = document.getElementById('phone').value
            const adminEmail = document.getElementById('email').value
            const username = document.getElementById('username').value
            const firstName = document.getElementById('first-name').value
            const lastName = document.getElementById('last-name').value
            const adminPhone = document.getElementById('admin-phone').value
            const password = document.getElementById('password').value
            const confirmPassword = document.getElementById('confirm').value
            const type = document.getElementById('type').value
            const description = document.getElementById('description').value
            const terms = document.getElementById('terms').checked


            const test = document.getElementById('test').value

            if (test !== '') {
              return
            }

            if (organization === '' || contactPhone === '' || adminEmail === '' || username === '' || firstName === '' || lastName === '' || adminPhone === '' || password === '' || confirmPassword === '' || type === '' || description === '') {
              alert('Please fill out all fields')
              return
            }

            if (!terms) {
              alert('Please agree to the terms and conditions')
              return
            }

            if (password !== confirmPassword) {
              alert('Passwords do not match')
              return
            }

            const response = await props.handleSubmit({
              organization: organization,
              contactPhone: contactPhone,
              adminEmail: adminEmail,
              username: username,
              firstName: firstName,
              lastName: lastName,
              adminPhone: adminPhone,
              password: password,
              confirmPassword: confirmPassword,
              type: type,
              description: description,
              terms: terms
            })

            if (response === 'User already exists') {
              alert('User already exists')
            } else if (response === 'Username already exists') {
              alert('Username already exists')
            } else if (response === 'Organization already exists') {
              alert('Organization already exists')
            } else if (response === 'success') {
              router.push('/next-steps')
            } else {
              alert(response)
            }
          }}>
            Sign Up
          </button>
        </div>
      </div>
    </div >
  )
}
