import { MongoClient, ObjectId } from 'mongodb'

import { getServerSession } from 'next-auth'
import { options } from '@/app/api/auth/[...nextauth]/options'

const uri = process.env.MONGODB_URI


let client
let users
let org_members

export async function init() {
  if (client) return client
  client = new MongoClient(uri, {})
  await client.connect()
  users = client.db('manus-unitas').collection('users')
  const session = await getServerSession(options)
  if (session) {
    const user = await session.user
    users = client.db('manus-unitas').collection('users')
    const userEntry = await users.findOne({ email: user.email })
    const organization = userEntry.organization.databaseName
    org_members = client.db(organization).collection('people')
    console.log(org_members.find().toArray())
  } else {
    console.log('No session found')
  }
  return client

  close()
}

export async function close() {
  if (client) {
    await client.close()
  }
  client = null
  users = null
  org_members = null
}

export async function getUsers() {
  await init().catch(console.error)
  if (users === undefined) {
    return []
  } else {
    return users.find().toArray()
  }
}

export async function getOrgMembers() {
  await init().catch(console.error)
  if (org_members === undefined) {
    return []
  } else {
    return org_members.find().toArray()
  }
}

export async function getUser(id) {
  await init().catch(console.error)
  return users.findOne({ _id: new ObjectId(id) })
}

export async function getUserByEmail(email) {
  await init().catch(console.error)
  return users.findOne({ email: email })
}

export async function createUser(user) {
  await init().catch(console.error)
  return users.insertOne(user)
}

export async function updateUser(id, user) {
  await init().catch(console.error)
  console.log('UPDATED')
  // return users.updateOne({ _id: new ObjectId(id) }, { $set: user }, { upsert: false }) // MongoServerError: The dollar ($) prefixed field '$set' in '$set' is not allowed in the context of an update's replacement document. Consider using an aggregation pipeline with $replaceWith.
  // at async $$ACTION_0 (./src/app/dashboard/page.js:45:9)
  return users.updateOne({ _id: new ObjectId(id) }, user)
}

export async function deleteUser(id) {
  await init().catch(console.error)
  return users.deleteOne({ _id: new ObjectId(id) })
}