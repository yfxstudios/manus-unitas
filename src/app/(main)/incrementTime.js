'use server'

import Users from "@/lib/schemas/userSchema";

export default async function incrementTime(email, time) {
  await Users.updateOne({ email }, {
    $inc: { timeActive: time },
    $currentDate: { lastActive: true }
  });
}