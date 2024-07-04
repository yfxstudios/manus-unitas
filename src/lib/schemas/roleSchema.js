import mongoose from 'mongoose'
import Organization from './organizationSchema'

mongoose.connect(process.env.MONGODB_URI + 'manus-unitas')

const { Schema } = mongoose

const roleSchema = new Schema({
  name: { type: String, required: true },
  parent: {
    type: mongoose.Types.ObjectId,
    ref: 'roles',
  },
  subRoles: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'roles',
    },
  ],
  organizationId: {
    type: mongoose.Types.ObjectId,
    ref: Organization,
  },
})

let Roles

if (!mongoose.models.roles) {
  Roles = mongoose.model('roles', roleSchema)
} else {
  Roles = mongoose.models.roles
}

export default Roles