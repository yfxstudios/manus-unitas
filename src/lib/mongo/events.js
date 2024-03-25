import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
}

let client
let events

async function init() {
  if (client) return client
  client = new MongoClient(uri, options)
  await client.connect()
  events = client.db('manus-unitas').collection('events')
  console.log('MongoDB connected')
  return client
}

export async function getEvents() {
  await init().catch(console.error)
  return events.find().toArray()
}

export async function getEvent(id) {
  await init().catch(console.error)
  return events.findOne({ _id: ObjectId(id) })
}

export async function createEvent(event) {
  await init().catch(console.error)
  return events.insertOne(event)
}

export async function updateEvent(id, event) {
  await init().catch(console.error)
  return events.updateOne({ _id: ObjectId(id) }, { $set: event })
}

export async function deleteEvent(id) {
  await init().catch(console.error)
  return events.deleteOne({ _id: ObjectId(id) })
}