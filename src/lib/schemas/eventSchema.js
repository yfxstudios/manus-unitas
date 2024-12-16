import mongoose from "mongoose";
import Users from "./userSchema";
import Roles from "./roleSchema";
import Organization from "./organizationSchema";


mongoose.connect(process.env.MONGODB_URI + 'manus-unitas')

const { Schema } = mongoose

const eventSchema = new Schema({
  title: String,
  startTime: Date,
  endTime: Date,
  description: String,
  volunteers: [
    {
      type: mongoose.Types.ObjectId,
      ref: Users,
    }
  ],
  roles: [
    {
      parent: {
        type: mongoose.Types.ObjectId,
        ref: Roles,
      },
      subRoles: [
        {
          child: {
            type: mongoose.Types.ObjectId,
            ref: Roles,
          },
          volunteers: [
            {
              type: mongoose.Types.ObjectId,
              ref: Users,
            }
          ]
        }
      ]
    }
  ],
  accepted:
    [
      {
        type: mongoose.Types.ObjectId,
        ref: Users,
      }
    ],
  rejected: [
    {
      type: mongoose.Types.ObjectId,
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