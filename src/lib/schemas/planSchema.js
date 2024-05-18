import mongoose from 'mongoose'

mongoose.createConnection(process.env.MONGODB_URI + 'manus-unitas')

const { Schema } = mongoose

const planSchema = new Schema({
  productId: String,
  name: String,
  description: String,
  active: Boolean,
  prices: [
    {
      amount: Number,
      interval: String
    }
  ],
  createdAt: Date,
  updatedAt: Date
})

let Plan

if (!mongoose.models.plans) {
  Plan = mongoose.model('plans', planSchema)
} else {
  Plan = mongoose.models.plans
}

export default Plan