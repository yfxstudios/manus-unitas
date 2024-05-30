import { getEvents } from "@/lib/mongo/events";

async function handler(req, res) {
  const events = await getEvents();
  res.json(events);
}

export { handler as GET, handler as POST }