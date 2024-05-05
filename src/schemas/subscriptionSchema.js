import mongoose from 'mongoose'

mongoose.connect(process.env.MONGODB_URI + 'manus-unitas')

const { Schema } = mongoose

const subscriptionSchema = new Schema({
  subscriptionId: String,
  customerId: String,
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

if (!mongoose.models.subscription) {
  Subscription = mongoose.model('subscription', subscriptionSchema)
} else {
  Subscription = mongoose.models.subscription
}

export default Subscription