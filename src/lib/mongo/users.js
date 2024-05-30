import { ObjectId } from 'mongodb'

import { getServerSession } from 'next-auth'
import { options } from '@/app/api/auth/[...nextauth]/options'


import Users from '@/lib/schemas/userSchema'

import Stripe from 'stripe'

import mongoose from 'mongoose'


const uri = process.env.MONGODB_URI


let org_members
let users
let client


export async function init() {
  mongoose.connect(process.env.MONGODB_URI + 'manus-unitas')
  const session = await getServerSession(options)
  if (session) {
    const user = await session.user
    // users = client.db('manus-unitas').collection('users')
    const userEntry = await Users.findOne({ email: user.email })
    const organization = userEntry.organization
    // org_members = client.db(organization).collection('people')
    // console.log(org_members.find().toArray())
  } else {
    console.log('No session found')
  }
}

export async function close() {
  if (client) {
    await client.close()
  }
  org_members = null
}

export async function getUsers() {
  await init().catch(console.error)
  if (users === undefined) {
    return []
  } else {
    return Users.find({})
  }
}

export async function getOrgMembers() {
  await init().catch(console.error)
  const { user } = await getServerSession(options)
  const userEntry = await Users.findOne({ email: user.email })
  const organization = userEntry.organizationId
  return Users.find({ organizationId: organization })
}


export async function getOrgMember(id) {
  await init().catch(console.error)
  return org_members.findOne({ _id: new ObjectId(id) })
}

export async function getUser(id) {
  await init().catch(console.error)
  return users.findOne({ _id: new ObjectId(id) })
}

export async function getUserByEmail(email) {
  await init().catch(console.error)
  if (users === undefined) {
    return null
  }
  return users.findOne({ email: email })
}

export async function createUser(user) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-04-10",
  })

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.first_name + ' ' + user.last_name,
    phone: user.phone,
  })

  const newUser = new Users({
    ...user,
    customerId: customer.id
  })

  await newUser.save().catch(console.error)

  return 'success'
}

export async function updateUser(id, user) {
  await init().catch(console.error)
  console.log('UPDATED')
  // return users.updateOne({ _id: new ObjectId(id) }, { $set: user }, { upsert: false }) // MongoServerError: The dollar ($) prefixed field '$set' in '$set' is not allowed in the context of an update's replacement document. Consider using an aggregation pipeline with $replaceWith.
  // at async $$ACTION_0 (./src/app/dashboard/page.js:45:9)
  return users.updateOne({ _id: new ObjectId(id) }, user)
}

export async function acceptUserByEmail(email, organization) {
  await init().catch(console.error)
  console.log('UPDATED')
  return users.updateOne({ email: email }, {
    $set: {
      organization: {
        displayName: organization.displayName,
        databaseName: organization,
        admin: false,
        accepted: true,
        declined: false,
      }
    }
  })
}

export async function declineUserByEmail(email, organization) {
  await init().catch(console.error)
  console.log('UPDATED')
  return users.updateOne({ email: email }, {
    $set: {
      organization: {
        displayName: organization.displayName,
        databaseName: organization,
        admin: false,
        accepted: false,
        declined: true
      }
    }
  })
}

export async function deleteUser(email) {
  await init().catch(console.error)
  await org_members.deleteMany({ email: email })
  return users.deleteOne({ email: email })
}