import mongoose from 'mongoose'

mongoose.connect(process.env.MONGODB_URI + 'manus-unitas')

const { Schema } = mongoose

const organizationSchema = new Schema({
  displayName: String,
  databaseName: String,
  type: String,
  description: String,
  website: String,
  address: String,
  phone: String,
  email: String
})

let Organization

if (!mongoose.models.organization) {
  Organization = mongoose.model('organization', organizationSchema)
} else {
  Organization = mongoose.models.organization
}

export default Organization

