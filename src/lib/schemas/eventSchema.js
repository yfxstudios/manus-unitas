import mongoose from "mongoose";
import Users from "./userSchema";


mongoose.connect(process.env.MONGODB_URI + 'manus-unitas')

const { Schema } = mongoose

const eventSchema = new Schema({
  title: String,
  date: String,
  startTime: String,
  endTime: String,
  description: String,
  volunteers: [
    {
      type: mongoose.Types.ObjectId,
      default: [],
      ref: Users,
    }
  ],
  accepted: [
    {
      type: mongoose.Types.ObjectId,
      default: [],
      ref: Users,
    }
  ],
  rejected: [
    {
      type: mongoose.Types.ObjectId,
      default: [],
      ref: Users,
    }
  ],
  organizationId: String
})

let Events

if (!mongoose.models.events) {
  Events = mongoose.model('events', eventSchema)
} else {
  Events = mongoose.models.events
}

export default Events