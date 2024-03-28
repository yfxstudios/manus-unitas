

import { getEvents, updateEvent, getEvent, close, createEvent } from "@/lib/mongo/events";
import { getUserByEmail } from "@/lib/mongo/users";

import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

import Dashboard from "./dashboard";





export default async function page() {
  let events = await getEvents();

  const session = await getServerSession(options)


  const user = await getUserByEmail(session.user.email);




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

  const handleAccept = async (id) => {
    'use server'
    const event = await getEvent(id);

    const username = user.username

    // console.log(await getUserByEmail(session.user.email).username)



    if (!event) {
      return
    }


    // Filter out circular references and extract necessary data



    if (event.volunteers[username]) {

      // Volunteer has been requested for this event
      // update accepted status of specified volunteer

      await updateEvent(id, { $set: { [`volunteers.${username}.accepted`]: true, [`volunteers.${username}.declined`]: false } });
    } else {
      console.log('Volunteer not found')
    }
  }

  const handleDecline = async (id) => {
    'use server'

    const event = await getEvent(id);

    const username = user.username;

    if (!event) {
      return
    }

    if (event.volunteers[username]) {

      // Volunteer has been requested for this event
      // update accepted status of specified volunteer

      await updateEvent(id, { $set: { [`volunteers.${username}.accepted`]: false, [`volunteers.${username}.declined`]: true } });
    } else {
      console.log('Volunteer not found')
    }

  }

  const handleLogout = async () => {
    "use server"
    await close();
  }

  const createEventHandler = async (event) => {
    'use server'
    console.log('Create event handler')
    createEvent(event);
  }



  return (
    <Dashboard events={events} handleAccept={handleAccept} handleDecline={handleDecline} logoutHandler={handleLogout} createEventHandler={createEventHandler} user={user} />
  )
}
