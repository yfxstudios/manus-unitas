import { options } from "@/app/api/auth/[...nextauth]/options";
import Organization from "@/lib/schemas/organizationSchema";
import Users from "@/lib/schemas/userSchema";
import { getServerSession } from "next-auth";

import People from "./people";
import { revalidatePath } from "next/cache";

export default async function page() {
  'use server'
  const session = await getServerSession(options)

  const user = await Users.findOne({ email: session.user.email }).lean()

  const users = await Users.find({
    organizationId: user.organizationId
  }).lean()

  const org = await Organization.findOne({ _id: user.organizationId }).lean()

  console.log(users)

  const onEditUser = async (data, uid) => {
    'use server'
    console.log(data, uid)

    const user = await Users.findOneAndUpdate({ _id: uid }, data, { new: true }).lean()

    revalidatePath('/people')
  }

  const onDeleteUser = async (uid) => {
    'use server'
    console.log(uid)

    await Users.findOneAndDelete({ _id: uid }).lean()

    revalidatePath('/people')
  }

  return (
    <People user={user} users={users} org={org} onEditUser={onEditUser} onDeleteUser={onDeleteUser} />
  )

}