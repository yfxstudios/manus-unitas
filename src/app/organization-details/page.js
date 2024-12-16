import { getServerSession } from 'next-auth'
import { options } from '../api/auth/[...nextauth]/options'
import { getUserByEmail } from '@/lib/mongo/users'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createOrganization } from '@/lib/mongo/organization'
import OrganizationForm from './OrganizationForm';
import Users from '@/lib/schemas/userSchema'
import Events from '@/lib/schemas/eventSchema'
import Organization from '@/lib/schemas/organizationSchema'

export default async function page() {
  const session = await getServerSession(options)

  if (!session) {
    redirect('/')
  }

  const databaseUser = await Users.findOne({ email: session.user.email })


  if (databaseUser.completedSignup) {
    redirect('/dashboard')
  }

  const handleSubmit = async (data) => {
    'use server'
    const organization = new Organization({
      displayName: data.organizationName,
      databaseName: data.organizationName.toLowerCase().replace(/ /g, '-'),
      type: data.organizationType,
      description: data.organizationDescription,
      website: data.organizationWebsite,
      address: data.organizationAddress,
      phone: data.organizationPhone,
      email: data.organizationEmail
    })

    await organization.save()

    await Users.updateOne({ email: session.user.email }, {
      organizationId: organization._id,
      completedSignup: true
    })

    redirect('/subscribe')
  }


  return (
    <OrganizationForm handleSubmit={handleSubmit} />
  )
}