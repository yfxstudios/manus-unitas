'use client'

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

// import { longDate } from "@/lib/util/date";
import { longDate } from '@/lib/util/date'
import { standardTime } from "@/lib/util/time";
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import { CaretDown, CaretLeft, Gear, Users, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import NewEventForm from "./_components/newEventForm";




export default function Dashboard(props) {
  const events = props.events
  const [loading, setLoading] = useState(false)



  // console.log(events)

  const [selectedEvent, setSelectedEvent] = useState(null);


  const handleAccept = async (id) => {
    setLoading(true)
    await props.handleAccept(id)
  }

  const handleDecline = async (id) => {
    setLoading(true)
    await props.handleDecline(id)
  }

  const logoutHandler = async () => {
    setLoading(true)

    await signOut({
      callbackUrl: "/"
    })
    await props.logoutHandler().then(() => {
      setLoading(false)
    })
  }


  const [accordionOpen, setAccordionOpen] = useState(false)



  // re fetch selectedEvent
  useEffect(() => {
    if (selectedEvent) {
      setSelectedEvent(events.find((event) => event._id === selectedEvent._id))
      setLoading(false)
    }
  }, [events])


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
          {/* // set defaultValue to "item-1" if events.length === 0 */}
          <Accordion type="single" collapsible defaultValue={events.length === 0 ? "item-1" : ""} value={accordionOpen} onValueChange={setAccordionOpen}>
            <AccordionItem value="item-1">
              <AccordionTrigger>Create Event</AccordionTrigger>
              <AccordionContent>
                <NewEventForm onSubmit={async (e) => {
                  await props.createEvent(e)
                  setAccordionOpen(false)
                }} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <ScrollArea className="max-h-[calc(100vh-400px)] w-full p-3">
            {events.map((event) => (
              <Card key={event._id} className="mb-4">
                <CardHeader>
                  <CardTitle>
                    {event.title}
                  </CardTitle>
                  <CardDescription>
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{longDate(event.date)}</p>
                  <p>{standardTime(event.startTime)} to {standardTime(event.endTime)}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={(e) => {
                    setSelectedEvent(event)
                  }}>View</Button>
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
                    <CardTitle>
                      {selectedEvent.title}
                    </CardTitle>
                    <CardDescription>
                      {selectedEvent.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{longDate(selectedEvent.date)}</p>
                    <p>{standardTime(selectedEvent.startTime)} to {standardTime(selectedEvent.endTime)}</p>
                    <br />
                    <div className="flex flex-col space-y-4">
                      {selectedEvent.volunteers.map((volunteer) => (
                        <div key={volunteer._id} className="flex flex-row space-x-4 items-center">
                          <div className="h-12 w-12 bg-secondary rounded-full">
                            {/* TODO: add profile image */}
                          </div>
                          <div className="flex flex-col">
                            <h1 className="text-lg font-semibold">{volunteer.first_name} {volunteer.last_name}</h1>
                            <p className="text-sm">{volunteer.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-row space-x-4">
                    <Button variant="outline" onClick={(e) => {
                      handleAccept(selectedEvent._id)
                    }}>Accept Position</Button>
                    <Button variant="outline" onClick={(e) => {
                      handleDecline(selectedEvent._id)
                    }}>Decline Position</Button>
                    <Button variant="destructive" onClick={(e) => {
                      props.deleteEvent(selectedEvent._id)
                      setSelectedEvent(null)
                    }}>Delete Event</Button>
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
      </div >
    </div >
  )
}
