import { getEvents } from "@lib/mongo/events";

export async function GET(req, res) {
  try {
    const events = await getEvents();
    res.status(200).json(events);
  } catch (error) {
    res.status(400).json({ message: "Events not found" });
  }
}