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
  organization: {
    databaseName: String,
    displayName: String,
    admin: Boolean,
    accepted: Boolean,
    declined: Boolean
  },
  completedSignup: Boolean,
  completedTutorial: Boolean,
  customerID: String,
})

let Users

if (!mongoose.models.users) {
  Users = mongoose.model('users', userSchema)
} else {
  Users = mongoose.models.users
}

export default Users