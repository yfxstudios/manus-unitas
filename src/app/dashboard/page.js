

import { getEvents, updateEvent, getEvent, close } from "@/lib/mongo/events";

import Dashboard from "./dashboard";



export default async function page() {
  const events = await getEvents();


  if (!events) {
    return
  }

  // if (events[0]._id === undefined) {
    // console.log('Events is not loaded properly:');
    // return
  // }

  if (typeof events !== 'object') {
    // Handle the case where events is not an object (maybe it's undefined, null, or another type)
    console.error('Events is not an object:', events);
    // Return or handle the error appropriately
    return;
  }

  // console.log(events);

  const handleAccept = async (id, name) => {
    'use server'
    const event = await getEvent(id);
  
    // Filter out circular references and extract necessary data

    if (event.volunteers[name]) {

      // Volunteer has been requested for this event
      // update accepted status of specified volunteer

      await updateEvent(id, { $set: { [`volunteers.${name}.accepted`]: true, [`volunteers.${name}.declined`]: false } });
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

    if (event.volunteers[name]) {

      // Volunteer has been requested for this event
      // update accepted status of specified volunteer

      await updateEvent(id, { $set: { [`volunteers.${name}.accepted`]: false, [`volunteers.${name}.declined`]: true } });
    } else {
      console.log('Volunteer not found')
    }

  }

  const handleLogout = async () => {
    "use server"
    await close();
  }



  return (
    <Dashboard events={events} handleAccept={handleAccept} handleDecline={handleDecline} logoutHandler={handleLogout} />
  )
}
