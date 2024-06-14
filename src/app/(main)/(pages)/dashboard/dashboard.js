"use client";

import { signOut } from "next-auth/react";
import { Suspense, useState } from "react";

// import { longDate } from "@/lib/util/date";
import { Button } from "@/components/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import EventList from "./_components/eventList";
import NewEventForm from "./_components/newEventForm";
import SelectedEvent from "./_components/selectedEvent";
import Loading from "../loading";

export default function Dashboard(props) {
  const router = useRouter()
  const events = props.events;
  const [loading, setLoading] = useState(false);

  // console.log(events)

  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleAccept = async id => {
    console.log(id);
    setLoading(true);
    setSelectedEvent({
      _id: selectedEvent._id,
    })
    await props.handleAccept(id);
    setLoading(false);
    router.refresh()
  };

  const handleDecline = async id => {
    console.log(id);
    setLoading(true);
    setSelectedEvent(...selectedEvent, { volunteers: selectedEvent.volunteers.filter(volunteer => volunteer !== props.user._id) });
    await props.handleDecline(id);
    setLoading(false);
  };

  const logoutHandler = async () => {
    setLoading(true);

    await signOut({
      callbackUrl: "/",
    });
    await props.logoutHandler().then(() => {
      setLoading(false);
    });
  };

  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")


  return (
    <div className="flex flex-row">
      {/* <div className="flex flex-col space-y-4 bg-base-300 sticky left-0 top-0 w-1 /6 h - screen z - 5 px - 4 py - 8">
        <Separator />
      </div > */}
      <div className="flex flex-col lg:flex-row justify-center gap-8 w-full px-4 xs:px-8 py-16 lg:px-36 lg:pt-48">
        <div className="flex flex-col lg:w-1/2 space-y-4">
          <div className="flex flex-row space-x-4 items-center">
            <h1 className="text-2xl font-semibold">Events</h1>
          </div>

          {props.user.admin && (
            <>
              {isDesktop ? (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">New Event</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>New Event</DialogTitle>
                      <DialogDescription>
                        Create a new event for your organization.
                      </DialogDescription>
                    </DialogHeader>
                    <NewEventForm
                      onSubmit={async e => {
                        await props.createEvent(e);
                        setOpen(false);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              ) : (
                <Drawer open={open} onOpenChange={setOpen}>
                  <DrawerTrigger asChild>
                    <Button variant="outline">New Event</Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="text-left">
                      <DrawerTitle>New Event</DrawerTitle>
                      <DrawerDescription>
                        Create a new event for your organization.
                      </DrawerDescription>
                    </DrawerHeader>
                    <NewEventForm className="px-4"
                      onSubmit={async e => {
                        await props.createEvent(e);
                        setOpen(false);
                      }}
                    />
                    <DrawerFooter className="pt-2">
                      <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              )}
            </>
          )}

          <ScrollArea className="max-h-[calc(100vh-400px)] w-full">
            <Suspense fallback={
              <Loading />
            }>
              <EventList
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
              />
            </Suspense>
          </ScrollArea>
        </div>
        <div className="flex flex-col lg:w-1/2 space-y-4">
          <div className="flex flex-col space-y-4 rounded-xl">
            {/* more information about event */}
            <h1 className="text-2xl font-semibold">Event</h1>
            <div className="flex flex-col bg-base-300 rounded-xl relative">
              {loading && (
                <div className="flex justify-center items-center z-10 rounded-xl bg-black opacity-50 w-full h-full absolute p-0 m-0">
                  <div className="loading loading-dots size-16 p-0 m-0" />
                </div>
              )}
              <Suspense fallback={
                <p className="text-lg">Select an event to view more information.</p>
              }>
                <SelectedEvent
                  selectedEvent={selectedEvent}
                  setSelectedEvent={setSelectedEvent}
                  handleAccept={handleAccept}
                  handleDecline={handleDecline}
                  deleteEvent={props.deleteEvent}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
