import { getEvent } from "@/lib/mongo/events";


export default async function GET(req, res) {
  const id = req.params.slug

  try {
    const event = await getEvent(id);
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ message: "Event not found" });
  }
}