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

export default function Dashboard(props) {
  const events = props.events;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Rendered");
  }, []);

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

  return (
    <div className="flex flex-row">
      {/* <div className="flex flex-col space-y-4 bg-base-300 sticky left-0 top-0 w-1 /6 h - screen z - 5 px - 4 py - 8">
        <Separator />
      </div > */}
      <div className="flex flex-col lg:flex-row justify-center gap-8 w-full px-8 py-16 lg:px-36 lg:pt-48">
        <div className="flex flex-col lg:w-1/2 space-y-4">
          <div className="flex flex-row space-x-4 items-center">
            <h1 className="text-2xl font-semibold">Events</h1>
          </div>
          {props.user.admin && (
            <Accordion
              type="single"
              collapsible
              defaultValue={events.length === 0 ? "item-1" : ""}
              value={accordionOpen}
              onValueChange={setAccordionOpen}
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>Create Event</AccordionTrigger>
                <AccordionContent>
                  <NewEventForm
                    onSubmit={async e => {
                      await props.createEvent(e);
                      setAccordionOpen(false);
                    }}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          <ScrollArea className="max-h-[calc(100vh-400px)] w-full p-3">
            {events.map(event => (
              <Card key={event._id} className="mb-4">
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{longDate(event.date)}</p>
                  <p>
                    {standardTime(event.startTime)} to{" "}
                    {standardTime(event.endTime)}
                  </p>
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
                  {event.accepted.includes(props.user._id) && (
                    <div className="flex flex-row items-center gap-2">
                      <p className="text-green-600">Accepted</p>
                      <Check className="text-green-600" />
                    </div>
                  )}
                  {event.rejected.includes(props.user._id) && (
                    <div className="flex flex-row items-center gap-2">
                      <p className="text-red-600">Declined</p>
                      <X className="text-red-600" />
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </ScrollArea>
        </div>
        <div className="divider divider-horizontal h-1/2"></div>
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
                      {selectedEvent.title}
                      {props.user.admin && (
                        <div className="flex flex-row items-center gap-4 text-lg">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex flex-row items-center gap-2">
                                  <UserRound />
                                  <p>{selectedEvent.volunteers.length}</p>
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
                                  <p>{selectedEvent.accepted.length}</p>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Accepted Volunteers</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex flex-row items-center gap-2">
                                  <UserRoundX />
                                  <p>{selectedEvent.rejected.length}</p>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Declined Volunteers</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                        </div>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {selectedEvent.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{longDate(selectedEvent.date)}</p>
                    <p>
                      {standardTime(selectedEvent.startTime)} to{" "}
                      {standardTime(selectedEvent.endTime)}
                    </p>
                    <br />
                    <div className="flex flex-col space-y-4">
                      {selectedEvent.volunteers.map(volunteer => (
                        <div
                          key={volunteer._id}
                          className="flex flex-row space-x-4 items-center"
                        >
                          <div className="h-12 w-12 bg-secondary rounded-full">
                            {/* TODO: add profile image */}
                          </div>
                          <div className="flex flex-col">
                            <h1 className="text-lg font-semibold">
                              {volunteer.first_name} {volunteer.last_name}
                            </h1>
                            <p className="text-sm">{volunteer.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-row justify-end">
                    <div className="2xl:hidden gap-4 flex flex-row justify-end">
                      <Check
                        className={`cursor-pointer transition-colors hover:text-green-600 ${selectedEvent.accepted.includes(props.user._id) &&
                          "text-green-700"
                          }`}
                        onClick={e => {
                          handleAccept(selectedEvent._id);
                        }}
                      />
                      <X
                        className={`cursor-pointer transition-colors hover:text-red-500 ${selectedEvent.rejected.includes(props.user._id) &&
                          "text-red-600"
                          }`}
                        onClick={e => {
                          handleDecline(selectedEvent._id);
                        }}
                      />
                      {props.user.admin && (
                        <Trash
                          className="cursor-pointer transition-colors hover:text-red-600"
                          onClick={e => {
                            props.deleteEvent(selectedEvent._id);
                            setSelectedEvent(null);
                          }}
                        />
                      )}
                    </div>
                    <div className="hidden 2xl:flex gap-4">
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
    </div>
  );
}
