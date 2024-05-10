import { getEvents, updateEvent, getEvent, close, createEvent, deleteEvent } from "@/lib/mongo/events";
import { acceptUserByEmail, getOrgMembers, getUserByEmail, acceptUser, declineUserByEmail, declineUser } from "@/lib/mongo/users";

import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

import Dashboard from "./dashboard";
import { revalidatePath } from "next/cache";
import NotAccepted from "./notAccepted";
import { createRole, createType, deleteRole, deleteType, getRoles, updateRole } from "@/lib/mongo/organization";

import Subscription from "@/schemas/subscriptionSchema";
import Users from "@/schemas/userSchema";
import Events from "@/schemas/eventSchema";
import Stripe from "stripe";
import Organization from "@/schemas/organizationSchema";

import { ObjectId } from 'mongodb'


export const metadata = {
  title: "Dashboard | Manus Unitas",
}


export default async function page() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-04-10',
  });
  const session = await getServerSession(options)

  const user = await Users.findOne({ email: session.user.email }).lean()


  let subscription
  let subscriptionName


  if (user.admin) {
    subscription = await Subscription.findOne({ customerId: user.customerId }).lean()

    subscriptionName = await stripe.products.retrieve(subscription.productId).then(product => product.name)





    // console.log(subscription.status)

    if (subscription.status !== 'active') {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-3xl font-bold">Subscription Required</h1>
          <p className="text-lg">Please subscribe to access this page</p>
          <a href="/subscription" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Subscribe</a>
        </div>
      )
    }
  }


  let events = await Events.find({}).populate('volunteers').sort({ date: 1, startTime: 1 }).lean()



  const people = await getOrgMembers();

  let roles = [];
  let eventTypes = [];


  if (user) {
    console.log("USER FOUND", user.organizationId)
    roles = await getRoles(user.organizationId);
    eventTypes = roles.map(role => role.type)
    console.log(roles)
  }


  // clear interval after done
  // if (!people || !session || !user || !events) {
  //   setInterval(() => {
  //     revalidatePath('/dashboard')
  //   }, 2000)

  //   return (
  //     <div className="loading loading-spinner absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
  //   )
  // } else {
  //   clearInterval()
  // }

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

    const event = await Events.findById(id)

    if (event.rejected.includes(user._id)) {
      event.rejected.pull(user._id)
    }

    if (!event.accepted.includes(user._id)) {
      event.accepted.push(user._id)
    }

    await event.save()

    revalidatePath('/dashboard')
  }

  const handleDecline = async (id) => {
    'use server'

    const event = await Events.findById(id)


    if (event.accepted.includes(user._id)) {
      event.accepted.pull(user._id)
    }

    if (!event.rejected.includes(user._id)) {
      event.rejected.push(user._id)
    }


    await event.save()

    revalidatePath('/dashboard')
  }

  const handleLogout = async () => {
    "use server"
    await close();
  }

  const createEventHandler = async (e) => {
    'use server'
    console.log('Create event handler')
    const event = new Events(e);
    await event.save();

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
  // let filteredEvents = events.filter(event => {
  //   const date = new Date(event.date);
  //   const time = new Date(event.startTime);
  //   const now = new Date();



  //   if (date < now) {
  //     return false
  //   }

  //   if (date === now && time < now) {
  //     return false
  //   }

  //   return true
  // })

  const deleteEventHandler = async (id) => {
    'use server'
    await Events.findByIdAndDelete(id);
    update();
  }

  // check if user.accepted is true
  if (!user.accepted) {
    return (
      <NotAccepted user={user} handleLogout={handleLogout} />
    )
  }

  const acceptUserHandler = async (id, email) => {
    'use server'
    console.log(id)
    await acceptUser(id)
    await acceptUserByEmail(email, user.organizationId)
    update();
  }

  const declineUserHandler = async (id, email) => {
    'use server'
    await declineUser(id)
    await declineUserByEmail(email, user.organizationId)
    update();
  }


  const deleteUserHandler = async (email) => {
    'use server'
    // await api call to delete user
    const res = await fetch(`${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://manusunitas.com"}/api/users/${email}`, {
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


    await updateRole(user.organizationId, role.type, { $set: { roles: newRoles } }).then(() => {
      update()
    })
  }


  const deleteRoleHandler = async (roleType, roleName) => {
    'use server'
    // console.log(roleType, roleName)
    // await api call to delete role
    await deleteRole(user.organizationId, roleType, roleName).then(() => {
      update()
    })
  }

  const createRoleHandler = async (role, type) => {
    'use server'

    await createRole(user.organizationId, role, type).then(() => {
      update()
    })
  }

  const createTypeHandler = async (type) => {
    'use server'
    await createType(user.organizationId, type).then(() => {
      update()
    })
  }

  const deleteTypeHandler = async (type) => {
    'use server'
    // await api call to delete type
    await deleteType(user.organizationId, type).then(() => {
      update()
    })
  }

  const userOrg = await Organization.findById(user.organizationId)

  const populateEvent = async (id) => {
    'use server'
    const event = await Events.findOne({ _id: id }).populate('volunteers').lean().then(event => {
      console.log(event)
      return event
    })
  }





  return (
    <Dashboard events={events} unfilteredEvents={events} handleAccept={handleAccept} handleDecline={handleDecline} logoutHandler={handleLogout} createEventHandler={createEventHandler} deleteEvent={deleteEventHandler} updateEvent={handleUpdateEvent} user={user} people={people} acceptUser={acceptUserHandler} declineUser={declineUserHandler} deleteUserHandler={deleteUserHandler} roles={roles} eventTypes={eventTypes} updateRoleHandler={updateRoleHandler} deleteRoleHandler={deleteRoleHandler} createRoleHandler={createRoleHandler} createTypeHandler={createTypeHandler} deleteTypeHandler={deleteTypeHandler} update={update} session={session} subscriptionName={subscriptionName} userOrg={userOrg} populateEvent={populateEvent} />
  )

  // DEV NEW DASHBOARD
  // return (
  //   <Dashboard user={
  //     {
  //       organization: {
  //         admin: true,
  //         databaseName: "manus-unitas",
  //         displayName: "Your Mom llc",
  //       }
  //     }
  //   } />
  // )
}
