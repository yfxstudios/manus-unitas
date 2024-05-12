
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

import Dashboard from "./dashboard";
import { revalidatePath } from "next/cache";

import Subscription from "@/lib/schemas/subscriptionSchema";
import Users from "@/lib/schemas/userSchema";
import Events from "@/lib/schemas/eventSchema";
import Stripe from "stripe";
import Organization from "@/lib/schemas/organizationSchema";



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
    console.log('Logging out')
  }

  const createEventHandler = async (e) => {
    'use server'
    console.log('Create event handler')
    const event = new Events(e);
    await event.save();

    update();
  }

  const deleteEventHandler = async (id) => {
    'use server'
    await Events.findByIdAndDelete(id);
    update();
  }


  const userOrg = await Organization.findById(user.organizationId)



  return (
    <Dashboard events={events} unfilteredEvents={events} handleAccept={handleAccept} handleDecline={handleDecline} logoutHandler={handleLogout} createEventHandler={createEventHandler} deleteEvent={deleteEventHandler} user={user} update={update} session={session} subscriptionName={subscriptionName} userOrg={userOrg} />
  )
}
