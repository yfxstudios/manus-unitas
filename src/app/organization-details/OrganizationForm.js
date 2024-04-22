'use client'
import { useState } from 'react'
import phoneNumberFormatter from '@lib/util/phoneNumber'

export default function OrganizationForm({ handleSubmit }) {

  const [phoneNumber, setPhoneNumber] = useState('')
  const [orgPhoneNumber, setOrgPhoneNumber] = useState('')

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className='text-4xl font-bold mb-8'>Add Your Organization</h1>
      <div className="flex flex-col items-center justify-center">
        <p className="text-left w-96 mb-4">Basic Info</p>
        <input type="text" placeholder="Organization Name" className="input w-96 mb-4" id='organization-name' />
        <input type="text" placeholder="Type (Nonprofit, school, etc.)" className="input w-96 mb-4" id='organization-type' />
        <input type="text" placeholder="Website" className="input w-96 mb-4" id='organization-website' />
        <textarea placeholder="Brief description of your organization" className="input w-96 mb-4 p-4 h-24 resize-none" id='organization-description' />


        <p className="text-left w-96 mb-4">Contact Info</p>
        <input type="text" placeholder="(800) 867-5309" className="input w-96 mb-4" id='organization-phone' onChange={(e) => setOrgPhoneNumber(phoneNumberFormatter(e))} value={orgPhoneNumber} />
        <input type="text" placeholder="info@yourorganization.com" className="input w-96 mb-4" id='organization-email' />
        <input type="text" placeholder="9763 Mill St., Piedmont, CA 94620" className="input w-96 mb-4" id='organization-address' />

        <p className="text-left w-96 mb-4">Contact Person</p>
        <input type="text" placeholder="Tommy Tutone" className="input w-96 mb-4" id='organization-contact-name' />
        <input type="text" placeholder="(800) 867-5309" className="input w-96 mb-4" id='organization-contact-phone' onChange={(e) => setPhoneNumber(phoneNumberFormatter(e))} value={phoneNumber} />
        <input type="text" placeholder="ttutone@jen.com" className="input w-96 mb-4" id='organization-contact-email' />
        <button className="btn w-96" onClick={() => {
          const organizationName = document.getElementById('organization-name').value
          const organizationType = document.getElementById('organization-type').value
          const organizationDescription = document.getElementById('organization-description').value
          const organizationWebsite = document.getElementById('organization-website').value
          const organizationAddress = document.getElementById('organization-address').value
          const organizationPhone = document.getElementById('organization-phone').value
          const organizationEmail = document.getElementById('organization-email').value
          const organizationContactName = document.getElementById('organization-contact-name').value
          const organizationContactPhone = document.getElementById('organization-contact-phone').value
          const organizationContactEmail = document.getElementById('organization-contact-email').value

          if (organizationName === '' || organizationType === '' || organizationDescription === '' || organizationWebsite === '' || organizationAddress === '' || organizationPhone === '' || organizationEmail === '' || organizationContactName === '' || organizationContactPhone === '' || organizationContactEmail === '') {
            alert('Please fill out all fields')
            return
          }

          handleSubmit({
            organizationName,
            organizationType,
            organizationDescription,
            organizationWebsite,
            organizationAddress,
            organizationPhone,
            organizationEmail,
            organizationContactName,
            organizationContactPhone,
            organizationContactEmail
          })
        }}>Submit</button>
      </div>
    </div >
  )
}