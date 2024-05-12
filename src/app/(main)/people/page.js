import { options } from "@/app/api/auth/[...nextauth]/options";
import Organization from "@/lib/schemas/organizationSchema";
import Users from "@/lib/schemas/userSchema";
import { getServerSession } from "next-auth";

import People from "./people";

export default async function page() {
  'use server'
  const session = await getServerSession(options)

  const user = await Users.findOne({ email: session.user.email }).lean()

  const users = await Users.find({
    organizationId: user.organizationId
  }).lean()

  const org = await Organization.findOne({ _id: user.organizationId }).lean()

  console.log(users)

  return (
    <People user={user} users={users} org={org} />
  )

}