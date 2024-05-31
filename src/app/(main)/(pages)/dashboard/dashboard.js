"use client";

import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

// import { longDate } from "@/lib/util/date";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { longDate } from "@/lib/util/date";
import { standardTime } from "@/lib/util/time";
import {
  Check,
  Trash,
  UserRound,
  UserRoundCheck,
  UserRoundX,
  X,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import NewEventForm from "./_components/newEventForm";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Dashboard(props) {
  const events = props.events;
  const [loading, setLoading] = useState(false);

  // console.log(events)

  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleAccept = async id => {
    setLoading(true);
    await props.handleAccept(id);
  };

  const handleDecline = async id => {
    setLoading(true);
    await props.handleDecline(id);
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

  const [accordionOpen, setAccordionOpen] = useState(false);

  // re fetch selectedEvent
  useEffect(() => {
    if (selectedEvent) {
      setSelectedEvent(events.find(event => event._id === selectedEvent._id));
      setLoading(false);
    }
  }, [events]);

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
                    <NewEventForm />
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
            {events.map(event => (
              <Card key={event._id} className="mb-4">
                <CardHeader>
                  <CardTitle
                    className="flex flex-row justify-between items-center"
                  >
                    <span className="text-wrap break-words hyphens-auto">{event.title}</span>
                    <div className="hidden xs:flex">
                      {event.accepted.includes(props.user._id) && (
                        <div className="flex flex-row items-center gap-2">
                          <p className="text-green-600 font-normal">Accepted</p>
                          <Check className="text-green-600" />
                        </div>
                      )}
                      {event.rejected.includes(props.user._id) && (
                        <div className="flex flex-row items-center gap-2">
                          <p className="text-red-600 font-normal">Declined</p>
                          <X className="text-red-600" />
                        </div>
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-wrap break-words hyphens-auto">
                  <p>{longDate(event.date)}</p>
                  <p>
                    {standardTime(event.startTime)} to{" "}
                    {standardTime(event.endTime)}
                  </p>
                  <div className="flex xs:hidden">
                    {event.accepted.includes(props.user._id) && (
                      <div className="flex flex-row items-center gap-2">
                        <p className="text-green-600 font-normal">Accepted</p>
                        <Check className="text-green-600" />
                      </div>
                    )}
                    {event.rejected.includes(props.user._id) && (
                      <div className="flex flex-row items-center gap-2">
                        <p className="text-red-600 font-normal">Declined</p>
                        <X className="text-red-600" />
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-row justify-between">
                  <Button
                    variant="outline"
                    onClick={e => {
                      setSelectedEvent(event);
                    }}
                  >
                    View
                  </Button>
                  <div className="flex flex-col justify-center gap-4 ml-2">

                    {props.user.admin && (
                      <div className="flex flex-row flex-wrap items-center gap-4 text-lg">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex flex-row items-center gap-2">
                                <UserRound />
                                <p>{props.users.length}</p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Total Volunteers</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex flex-row items-center gap-2">
                                <UserRoundCheck />
                                <p>{event.accepted.length}</p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Accepted</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex flex-row items-center gap-2">
                                <UserRoundX />
                                <p>{event.rejected.length}</p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Declined</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}

                  </div>
                </CardFooter>
              </Card>
            ))}
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
              {selectedEvent ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex flex-row justify-between items-center">
                      <div className="flex-1 text-wrap break-words hyphens-auto">
                        {selectedEvent.title}
                      </div>

                    </CardTitle>
                    <CardDescription>
                      {selectedEvent.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-wrap break-words hyphens-auto text-sm xs:text-base">
                    <p>{longDate(selectedEvent.date)}</p>
                    <p>
                      {standardTime(selectedEvent.startTime)} to{" "}
                      {standardTime(selectedEvent.endTime)}
                    </p>
                    <br />
                    <div className="flex flex-col space-y-4">
                      {props.users.map(volunteer => (
                        <div
                          key={volunteer._id}
                          className="flex flex-row gap-4 items-center"
                        >
                          <Avatar className="flex-shrink-0 h-12 w-12 hidden xs:flex">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>
                              {volunteer.first_name.charAt(0)}
                              {volunteer.last_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex flex-col">
                            <h1 className="text-sm xs:text-lg font-semibold">
                              {volunteer.first_name} {volunteer.last_name}
                            </h1>
                            <p className="text-xs">{volunteer.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-row justify-end">
                    <div className="flex flex-row flex-wrap gap-4">
                      <Button
                        disabled={selectedEvent.accepted.includes(
                          props.user._id
                        )}
                        onClick={e => {
                          handleAccept(selectedEvent._id);
                        }}
                      >
                        Accept Position
                      </Button>
                      <Button
                        disabled={selectedEvent.rejected.includes(
                          props.user._id
                        )}
                        onClick={e => {
                          handleDecline(selectedEvent._id);
                        }}
                      >
                        Decline Position
                      </Button>
                      {props.user.admin && (
                        <Button
                          variant="destructive"
                          onClick={e => {
                            props.deleteEvent(selectedEvent._id);
                            setSelectedEvent(null);
                          }}
                        >
                          Delete Event
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ) : (
                <div className="flex flex-col space-y-4 p-4">
                  <p>Select an event to view more information</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
