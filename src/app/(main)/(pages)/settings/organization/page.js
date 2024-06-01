import Organization from "@/lib/schemas/organizationSchema"
import OrganizationForm from "./organization"
import Users from "@/lib/schemas/userSchema"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

const page = async () => {
  const session = await getServerSession()
  const user = await Users.findOne({ email: session.user.email }).lean()
  const organization = await Organization.findOne({ _id: user.organizationId })

  return (
    <OrganizationForm
      organization={organization}
      handleSubmit={async (data, id) => {
        'use server'
        await Organization.findByIdAndUpdate(id, data)
        revalidatePath('/settings/organization')

        return 'Organization updated successfully'
      }}
    />
  )
}
export default page