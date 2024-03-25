

import { getEvents } from "@/lib/mongo/events";

import Dashboard from "./dashboard";



export default async function page() {
  const events = await getEvents();

  console.log(events);




  return (
    <Dashboard events={events} />
  )
}
