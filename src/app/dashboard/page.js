

import { getEvents, updateEvent, getEvent, close, createEvent, deleteEvent } from "@/lib/mongo/events";
import { getOrgMembers, getUserByEmail } from "@/lib/mongo/users";

import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

import Dashboard from "./dashboard";
import { revalidatePath } from "next/cache";






export default async function page() {
  let events = await getEvents();

  const session = await getServerSession(options)

  const people = await getOrgMembers();

  const user = await getUserByEmail(session.user.email);

  const update = async () => {
    "use server"
    revalidatePath('/dashboard')
  }




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




    if (event.volunteers[username]) {

      // Volunteer has been requested for this event
      // update accepted status of specified volunteer

      await updateEvent(id, { $set: { [`volunteers.${username}.accepted`]: true, [`volunteers.${username}.declined`]: false } });
    } else {
      console.log('Volunteer not found')
    }

    update();
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

    update();
  }

  const handleLogout = async () => {
    "use server"
    await close();
  }

  const createEventHandler = async (event) => {
    'use server'
    console.log('Create event handler')
    createEvent(event);

    update();
  }


  const handleUpdateEvent = async (id, event) => {
    'use server'
    // await updateEvent(id, event);
    // await updateEvent(id, { $set: { [`volunteers.${username}.accepted`]: true, [`volunteers.${username}.declined`]: false } });
    await updateEvent(id, { $set: event });
    update();
  }

  // sort events by date and time and remove events that have already passed
  events = events.filter(event => {
    const date = new Date(event.date);
    const time = new Date(event.startTime);
    const now = new Date();



    if (date < now) {
      return false
    }

    if (date === now && time < now) {
      return false
    }

    return true
  }).sort((a, b) => {
    return new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time);
  })

  const deleteEventHandler = async (id) => {
    'use server'
    await deleteEvent(id)
    update();
  }

  // check if user.organization.accepted is true
  if (!user.organization.accepted) {
    return
  }



  return (
    <Dashboard events={events} handleAccept={handleAccept} handleDecline={handleDecline} logoutHandler={handleLogout} createEventHandler={createEventHandler} deleteEvent={deleteEventHandler} updateEvent={handleUpdateEvent} user={user} people={people} />
  )
}
