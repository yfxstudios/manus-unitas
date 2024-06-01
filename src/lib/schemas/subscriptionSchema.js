import mongoose from 'mongoose'
import { string } from 'zod'

mongoose.connect(process.env.MONGODB_URI + 'manus-unitas')

const { Schema } = mongoose

const subscriptionSchema = new Schema({
  subscriptionId: String,
  productId: String,
  customerId: String,
  organizationId: String,
  priceId: String,
  status: String,
  startDate: Date,
  endDate: Date,
  trialStartDate: Date,
  trialEndDate: Date,
  createdAt: Date,
  updatedAt: Date
})

let Subscription

if (!mongoose.models.subscriptions) {
  Subscription = mongoose.model('subscriptions', subscriptionSchema)
} else {
  Subscription = mongoose.models.subscriptions
}

export default Subscription