import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
}

let client
let users

export async function init() {
  if (client) return client
  client = new MongoClient(uri, options)
  await client.connect()
  users = client.db('manus-unitas').collection('users')
  console.log('MongoDB connected')
  return client
}

export async function getUsers() {
  await init().catch(console.error)
  if (users === undefined) {
    return []
  } else {
    return users.find().toArray()
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