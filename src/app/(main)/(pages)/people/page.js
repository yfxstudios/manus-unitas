import { options } from "@/app/api/auth/[...nextauth]/options";
import Organization from "@/lib/schemas/organizationSchema";
import Users from "@/lib/schemas/userSchema";
import { getServerSession } from "next-auth";

import People from "./people";
import { revalidatePath } from "next/cache";
import { sendMail } from "@/app/mail";
import { ObjectId } from "mongodb";

export default async function page() {
  'use server'
  const session = await getServerSession(options)

  const user = await Users.findOne({ email: session.user.email }).lean()


  const users = await Users.find({
    organizationId: user.organizationId
  }).lean()

  const org = await Organization.findOne({ _id: user.organizationId }).lean()


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

  const createPartialUser = async data => {
    'use server'
    console.log(data)

    const allUsers = await Users.find().lean()

    if (!data.email || !data.username || !data.phone) {
      return "Please fill out all fields"
    } else if (allUsers.find(user => user.email === data.email)) {
      return "Email is already in use"
    } else if (allUsers.find(user => user.username === data.username)) {
      return "Username is already in use"
    } else if (allUsers.find(user => user.phone === data.phone)) {
      return "Phone number is already in use"
    }

    const user = await Users.create({
      ...data,
      organizationId: new ObjectId(org._id),
      completedSignup: false,
      password: null
    })

    console.log(user._id) // new ObjectId('5f9f1b3b3b3b3b3b3b3b3b3b')

    sendMail({
      to: data.email,
      from: org.displayName + " <notifications@manusunitas.com>",
      subject: "Set your password for Manus Unitas",
      body: `
          <h1>
            Welcome to Manus Unitas
          </h1>
          <p>Your account has been created. Please click the link below to set your password.</p>
          <a href="https://manusunitas.com/set-password?id=${user._id}&email=${data.email}">Set Password</a>
          `
    })


    revalidatePath('/people')
  }

  return (
    <People user={user} users={users} org={org} onEditUser={onEditUser} onDeleteUser={onDeleteUser} createPartialUser={createPartialUser} />
  )

}