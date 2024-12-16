import { MongoClient, ObjectId } from 'mongodb'

import { getServerSession } from 'next-auth'
import { options } from '@/app/api/auth/[...nextauth]/options'

const uri = process.env.MONGODB_URI


let client
let events

let users

let session;


async function init() {
  session = await getServerSession(options)

  if (client) return client
  client = new MongoClient(uri, {})
  await client.connect()

  if (session) {
    // check for users email in manus-unitas database ->> users collection
    // find users organization from user entry in users collection

    const user = await session.user
    users = client.db('manus-unitas').collection('users')
    const userEntry = await users.findOne({ email: user.email })
    // console.log('userEntry', userEntry)
    const organization = userEntry.organization
    // console.log('organization', organization)
    events = client.db('manus-unitas').collection('events')
  }

  if (events === undefined) {
    console.log('No events collection found')
  } else if (events === null) {
    console.log('events collection is null')
  } else {
    console.log('MongoDB connected')
    return client
  }
}

export async function close() {
  if (client) {
    await client.close()
  }
  client = null
  events = null
}

export async function getEvents() {
  session = await getServerSession(options)
  await init().catch(console.error)


  if (events === undefined) {
    return []
  } else {
    return events.find().toArray()
  }
}

export async function getEvent(id) {
  await init().catch(console.error)
  return events.findOne({ _id: new ObjectId(id) })
}

export async function createEvent(event) {
  await init().catch(console.error)
  return events.insertOne(event)
}

export async function updateEvent(id, event) {
  await init().catch(console.error)
  console.log('UPDATED')
  // return events.updateOne({ _id: new ObjectId(id) }, { $set: event }, { upsert: false }) // MongoServerError: The dollar ($) prefixed field '$set' in '$set' is not allowed in the context of an update's replacement document. Consider using an aggregation pipeline with $replaceWith.
  // at async $$ACTION_0 (./src/app/dashboard/page.js:45:9)
  return events.updateOne({ _id: new ObjectId(id) }, event)
}

export async function deleteEvent(id) {
  await init().catch(console.error)
  return events.deleteOne({ _id: new ObjectId(id) })
}