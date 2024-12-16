import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
import Organization from './organizationSchema'

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
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: Organization,
  },
  organizationOwner: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
  // 0 - not accepted, 1 - accepted, 2 - declined
  accepted: { type: Number, default: 0, min: 0, max: 2 },
  completedSignup: { type: Boolean, default: false },
  completedTutorial: { type: Boolean, default: false },
  customerId: String,
  twoFactorAuth: {
    secret: { type: String, default: '' },
    verified: { type: Boolean, default: false },
  },
  timeActive: { type: Number, default: 0 },
  joined: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  lastLogout: { type: Date, default: Date.now },
  time: { type: Number, default: 0 },
  notifications: {
    newEvents: { type: Boolean, default: true },
    reminders: { type: Boolean, default: true },
  }
})

let Users

if (!mongoose.models.users) {
  Users = mongoose.model('users', userSchema)
} else {
  Users = mongoose.models.users
}

export default Users