import mongoose from "mongoose";
import Users from "./userSchema";
import Organization from "./organizationSchema";


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
  organizationId: {
    type: mongoose.Types.ObjectId,
    ref: Organization
  }
})

let Events

if (!mongoose.models.events) {
  Events = mongoose.model('events', eventSchema)
} else {
  Events = mongoose.models.events
}

export default Events