import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

import Dashboard from "./dashboard";
import { revalidatePath } from "next/cache";

import Subscription from "@/lib/schemas/subscriptionSchema";
import Users from "@/lib/schemas/userSchema";
import Events from "@/lib/schemas/eventSchema";
import Stripe from "stripe";
import Organization from "@/lib/schemas/organizationSchema";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { getEvents } from "@/app/actions";

export const metadata = {
  title: "Dashboard | Manus Unitas",
};

export default async function page() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-04-10",
  });

  const session = await getServerSession(options);

  const user = await Users.findOne(
    { email: session.user.email },
    { _id: 1, organizationId: 1, admin: 1 }
  ).lean();

  if (user.admin) {
    const subscription = await Subscription.findOne({
      organizationId: user.organizationId,
    }).lean();

    const subscriptionName = await stripe.products
      .retrieve(subscription.productId)
      .then(product => product.name);

    if (subscription.status !== "active") {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-3xl font-bold">Subscription Required</h1>
          <p className="text-lg">Please subscribe to access this page</p>
          <Button className="mt-4" asChild>
            <a href="/subscribe">Subscribe</a>
          </Button>
        </div>
      );
    }
  }

  const update = async () => {
    "use server";
    revalidatePath("/dashboard");
  };

  // console.log(events);

  const handleAccept = async id => {
    "use server";
    const event = await Events.findById(id);

    if (event.rejected.includes(user._id)) {
      event.rejected.pull(user._id);
    }

    if (!event.accepted.includes(user._id)) {
      event.accepted.push(user._id);
    }

    const user = await Users.findByIdAndUpdate(user._id, {
      $inc: {
        time: event.endTime - event.startTime,
      },
    });

    await event.save();
  };

  const handleDecline = async id => {
    "use server";
    const event = await Events.findById(id);

    if (event.accepted.includes(user._id)) {
      event.accepted.pull(user._id);
    }

    if (!event.rejected.includes(user._id)) {
      event.rejected.push(user._id);
    }

    const user = await Users.findByIdAndUpdate(user._id, {
      $inc: {
        time: event.endTime - event.startTime,
      },
    });


    await event.save();

    // mutate key "events"
  };

  const handleLogout = async () => {
    "use server";
    console.log("Logging out");
  };

  const createEvent = async e => {
    "use server";
    console.log("Create event handler");
    const event = new Events({
      title: e.title,
      description: e.description,
      date: e.date,
      startTime: e.startTime,
      endTime: e.endTime,
      organizationId: user.organizationId,
      volunteers: [user._id],
      accepted: [],
      rejected: [],
    });

    await event.save();

    update();
    return;
  };

  const deleteEventHandler = async id => {
    "use server";
    await Events.findByIdAndDelete(id);
    update();
  };

  const userOrg = await Organization.findById(user.organizationId);

  const users = await Users.find({
    organizationId: user.organizationId,
  }).lean();

  return (
    <Dashboard
      handleAccept={handleAccept}
      handleDecline={handleDecline}
      logoutHandler={handleLogout}
      createEvent={createEvent}
      deleteEvent={deleteEventHandler}
      user={user}
      update={update}
    />
  );
}
