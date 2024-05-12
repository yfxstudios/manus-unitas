import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

mongoose.connect(process.env.MONGODB_URI + 'manus-unitas')

const { Schema } = mongoose




const userSchema = new Schema({
  first_name: String,
  last_name: String,
  username: String,
  email: String,
  phone: String,
  password: String,
  // new ObjectId('5f9b3b3b3b3b3b3b3b3b3b3b'),
  organizationId: {},
  admin: { type: Boolean, default: false },
  // 0 - not accepted, 1 - accepted, 2 - declined
  accepted: { type: Number, default: 0, min: 0, max: 2 },
  completedSignup: { type: Boolean, default: false },
  completedTutorial: { type: Boolean, default: false },
  customerId: String
})

let Users

if (!mongoose.models.users) {
  Users = mongoose.model('users', userSchema)
} else {
  Users = mongoose.models.users
}

export default Users