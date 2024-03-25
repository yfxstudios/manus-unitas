

import { getEvents, updateEvent, getEvent } from "@/lib/mongo/events";

import Dashboard from "./dashboard";



export default async function page() {
  const events = await getEvents();

  // console.log(events);

  const handleAccept = async (id, name) => {
    'use server'
    const event = await getEvent(id);
    // console.log(event);
    
    if (!event) {
      return
    }

    // console.log(name)

    // console.log(event)


    if (event.volunteers[name]){

      // Volunteer has been requested for this event
      // update accepted status of specified volunteer
  
      await updateEvent(id, { $set: { [`volunteers.${name}.accepted`]: true, [`volunteers.${name}.declined`]:false } });
    } else {
      console.log('Volunteer not found')
    }
  }

  const handleDecline = async (id, name) => {
    'use server'
    
    const event = await getEvent(id);

    if (!event) {
      return
    }

    if (event.volunteers[name]){

      // Volunteer has been requested for this event
      // update accepted status of specified volunteer
  
      await updateEvent(id, { $set: { [`volunteers.${name}.accepted`]: false, [`volunteers.${name}.declined`]:true } });
    } else {
      console.log('Volunteer not found')
    }

  }

  return (
    <Dashboard events={events} handleAccept={handleAccept} handleDecline={handleDecline} />
  )
}
