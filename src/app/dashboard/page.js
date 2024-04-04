'use server'

import { getEvents, updateEvent, getEvent, close, createEvent, deleteEvent } from "@/lib/mongo/events";
import { acceptUserByEmail, getOrgMembers, getUserByEmail, acceptUser, declineUserByEmail, declineUser, deleteUser } from "@/lib/mongo/users";

import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

import Dashboard from "./dashboard";
import { revalidatePath } from "next/cache";
import NotAccepted from "./notAccepted";
import { createRole, createType, deleteRole, deleteType, getRoles, updateRole } from "@/lib/mongo/organization";





export default async function page() {
  let events = await getEvents();

  const session = await getServerSession(options)

  const people = await getOrgMembers();

  let user = await getUserByEmail(session.user.email);
  let roles = [];
  let eventTypes = [];


  if (user) {
    console.log("USER FOUND", user.organization.databaseName)
    roles = await getRoles(user.organization.databaseName);
    eventTypes = roles.map(role => role.type)
    console.log(roles)
  }


  // clear interval after done
  if (!people || !session || !user || !events) {
    setInterval(() => {
      revalidatePath('/dashboard')
    }, 2000)

    return (
      <div className="loading loading-spinner absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    )
  } else {
    clearInterval()
  }

  const update = async () => {
    "use server"
    revalidatePath('/dashboard')
  }

  if (!events) {
    return
  }


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

    console.log(username)


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
    // await updateEvent(id, {$set: {[`volunteers.${username}.accepted`]: true, [`volunteers.${username}.declined`]: false } });
    await updateEvent(id, { $set: event });
    update();
  }

  // sort events by date and time and remove events that have already passed
  let filteredEvents = events.filter(event => {
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
  })

  const deleteEventHandler = async (id) => {
    'use server'
    await deleteEvent(id)
    update();
  }

  // check if user.organization.accepted is true
  if (!user.organization.accepted) {
    return (
      <NotAccepted user={user} handleLogout={handleLogout} />
    )
  }

  const acceptUserHandler = async (id, email) => {
    'use server'
    console.log(id)
    await acceptUser(id)
    await acceptUserByEmail(email, user.organization)
    update();
  }

  const declineUserHandler = async (id, email) => {
    'use server'
    await declineUser(id)
    await declineUserByEmail(email, user.organization)
    update();
  }


  const deleteUserHandler = async (email) => {
    'use server'
    // await api call to delete user
    const res = await fetch(`http://localhost:3000/api/users/${email}`, {
      method: 'DELETE'
    })

    return res.status
  }



  const updateRoleHandler = async (newVal, role, old) => {
    'use server'
    // console.log(newVal, role)
    // newVal = "Worship Leader 1", role = {
    //   _id: "616b1f6c0e1a5b3d8a4c8d4e",
    //   type: "Sunday Service",
    //   roles: ["Worship Leader", "Audio", "ProPresenter"] <--------- find old value in this array
    // }

    const newRoles = role.roles.map(r => {
      if (r === old) {
        return newVal
      }
      return r
    })

    console.log(newRoles)


    await updateRole(user.organization.databaseName, role.type, { $set: { roles: newRoles } }).then(() => {
      update()
    })
  }


  const deleteRoleHandler = async (roleType, roleName) => {
    'use server'
    // console.log(roleType, roleName)
    // await api call to delete role
    await deleteRole(user.organization.databaseName, roleType, roleName).then(() => {
      update()
    })
  }

  const createRoleHandler = async (role, type) => {
    'use server'

    await createRole(user.organization.databaseName, role, type).then(() => {
      update()
    })
  }

  const createTypeHandler = async (type) => {
    'use server'
    await createType(user.organization.databaseName, type).then(() => {
      update()
    })
  }

  const deleteTypeHandler = async (type) => {
    'use server'
    // await api call to delete type
    await deleteType(user.organization.databaseName, type).then(() => {
      update()
    })
  }

  return (
    <Dashboard events={filteredEvents} unfilteredEvents={events} handleAccept={handleAccept} handleDecline={handleDecline} logoutHandler={handleLogout} createEventHandler={createEventHandler} deleteEvent={deleteEventHandler} updateEvent={handleUpdateEvent} user={user} people={people} acceptUser={acceptUserHandler} declineUser={declineUserHandler} deleteUserHandler={deleteUserHandler} roles={roles} eventTypes={eventTypes} updateRoleHandler={updateRoleHandler} deleteRoleHandler={deleteRoleHandler} createRoleHandler={createRoleHandler} createTypeHandler={createTypeHandler} deleteTypeHandler={deleteTypeHandler} />
  )
}
