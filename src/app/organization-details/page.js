import { getServerSession } from 'next-auth'
import { options } from '../api/auth/[...nextauth]/options'
import { getUserByEmail } from '@/lib/mongo/users'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createOrganization } from '@/lib/mongo/organization'
import OrganizationForm from './OrganizationForm';
import Users from '@/lib/schemas/userSchema'
import Events from '@/lib/schemas/eventSchema'

export default async function page() {
  const session = await getServerSession(options)

  if (!session) {
    redirect('/')
  }

  const databaseUser = await getUserByEmail(session.user.email)


  if (!databaseUser || !session && window !== 'undefined') {
    setTimeout(() => {
      revalidatePath('/')
    }, 2000)
    return (
      <div className="loading loading-spinner absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    )
  } else {
    clearTimeout()
  }

  if (databaseUser.completedSignup) {
    redirect('/dashboard')
  }

  const handleSubmit = async ({ organizationName, organizationType, organizationDescription, organizationWebsite, organizationAddress, organizationPhone, organizationEmail, organizationContactName, organizationContactPhone, organizationContactEmail }) => {
    'use server'



    if (organizationName === '' || organizationType === '' || organizationDescription === '' || organizationWebsite === '' || organizationAddress === '' || organizationPhone === '' || organizationEmail === '' || organizationContactName === '' || organizationContactPhone === '' || organizationContactEmail === '') {
      // alert('Please fill out all fields')
      return 'Please fill out all fields'
    }

    const response = await createOrganization({
      displayName: organizationName,
      databaseName: organizationName.trim().toLowerCase().replace(/ /g, '-'),
      type: organizationType,
      description: organizationDescription,
      website: organizationWebsite,
      address: organizationAddress,
      phone: organizationPhone,
      email: organizationEmail,
      contactName: organizationContactName,
      contactPhone: organizationContactPhone,
      contactEmail: organizationContactEmail
    }, databaseUser)


    // update user organizationId
    await Users.updateOne({ email: databaseUser.email }, { organizationId: response._id })


    if (response === 'Organization already exists') {
      alert('Organization already exists')
    } else {
      redirect('/subscription')
    }
  }


  return (
    <OrganizationForm handleSubmit={handleSubmit} />
  )
}