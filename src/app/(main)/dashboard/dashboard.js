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




export default function Dashboard(props) {
  const pathName = usePathname()
  const events = props.events
  const [loading, setLoading] = useState(false)
  const [creatingEvent, setCreatingEvent] = useState(false)


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


  const [selectedNavOption, setSelectedNavOption] = useState("events")



  // re fetch selectedEvent
  useEffect(() => {
    if (selectedEvent) {
      setSelectedEvent(events.find((event) => event._id === selectedEvent._id))
      setLoading(false)
    }
  }, [events])


  return (
    <div className="flex flex-row">
      <div className="flex flex-col space-y-4 bg-base-300 sticky left-0 top-0 w-1/6 h-screen z-5 px-4 py-8">
        <h1 className="text-3xl font-semibold">{props.userOrg.displayName}</h1>
        <Separator />
        {/* <div className={`flex flex-row space-x-4 items-center rounded-xl p-4 cursor-pointer transition-all ${selectedNavOption === "events" ? "bg-primary hover:bg-primary/85" : "bg-base-200 hover:bg-base-100"}`} onClick={(e) => { setSelectedNavOption("events") }}>
          <CalendarBlank size={32} />
          <p className="text-[14px]">Events</p>
        </div>
        <div className={`flex flex-row space-x-4 items-center rounded-xl p-4 cursor-pointer transition-all ${selectedNavOption === "people" ? "bg-primary hover:bg-primary/85" : "bg-base-200 hover:bg-base-100"}`} onClick={(e) => { setSelectedNavOption("people") }}>
          <Users size={32} />
          <p className="text-[14px]">People</p>
        </div>
        <div className={`flex flex-row space-x-4 items-center rounded-xl p-4 cursor-pointer transition-all ${selectedNavOption === "settings" ? "bg-primary hover:bg-primary/85" : "bg-base-200 hover:bg-base-100"}`} onClick={(e) => { setSelectedNavOption("settings") }}>
          <Gear size={32} />
          <p className="text-[14px]">Settings</p>
        </div>
        <div className="divider"></div> */}

      </div>
      <div className="flex flex-row justify-center space-x-8 w-full px-36 py-48">
        <div className="flex flex-col w-1/2 space-y-4">
          <div className="flex flex-row space-x-4 items-center">
            <h1 className="text-2xl font-semibold">Events</h1>
          </div>
          {events.map((event) => (
            <div className="flex flex-col space-y-4 shadow-lg rounded-xl p-4 bg-base-300 hover:scale-[1.03] transition-all cursor-pointer" onClick={(e) => {
              setSelectedEvent(event)
            }}
              key={event._id}
            >
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p>{longDate(event.date)}</p>
              <p>{standardTime(event.startTime)} to {standardTime(event.endTime)}</p>
              <p>{event.description}</p>
            </div>
          ))}
          {events.length === 0 && (
            <div className="flex flex-col space-y-4 rounded-xl relative">
              <div className="flex flex-col space-y-4">
                <Input type="text" placeholder="Title" id="title" />
                <Input type="date" placeholder="Date" id="date" />
                <Input type="time" placeholder="Start Time" id="startTime" />
                <Input type="time" placeholder="End Time" id="endTime" />
                <Textarea placeholder="Description" id="description" />
                <Button onClick={(e) => {
                  setCreatingEvent(false)
                  props.createEventHandler({
                    title: document.getElementById("title").value,
                    date: document.getElementById("date").value,
                    startTime: document.getElementById("startTime").value,
                    endTime: document.getElementById("endTime").value,
                    description: document.getElementById("description").value,
                    volunteers: [
                      {
                        _id: props.user._id,
                      }
                    ],
                    organization: props.userOrg._id
                  })
                }}
                >Create Event</Button>
              </div>
            </div>
          )}


        </div>
        <div className="divider divider-horizontal h-1/2"></div>
        <div className="flex flex-col w-1/2 space-y-4">
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
                <div className="m-4">
                  <h2 className="text-xl font-semibold">{selectedEvent.title}</h2>
                  <p>{longDate(selectedEvent.date)}</p>
                  <p>{standardTime(selectedEvent.startTime)} to {standardTime(selectedEvent.endTime)}</p>
                  <p>{selectedEvent.description}</p>
                  <div className="flex flex-col space-y-4 items-flex-start my-6">
                    <h3 className="font-semibold">Volunteers</h3>
                    <ul className="flex flex-col space-y-2 px-2">
                      {selectedEvent.volunteers.map((volunteer) => (
                        <li key={volunteer.username} className="flex items-center justify-between rounded-lg">
                          <div className={`flex items-center border-b-[6px] bg-base-100 p-2 justify-between ${selectedEvent.accepted.includes(volunteer._id) ? "border-success" : selectedEvent.rejected.includes(volunteer._id) ? "border-error" : "border-neutral"}`}>
                            <p>
                              {volunteer.first_name} {volunteer.last_name}
                            </p>
                          </div>
                          <p>{volunteer.role}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-row justify-between mt-4">
                    <div className="flex space-x-4">
                      <Button variant="outline" onClick={(e) => {
                        handleAccept(selectedEvent._id)
                      }}>Accept Position</Button>
                      <Button variant="outline" onClick={(e) => {
                        handleDecline(selectedEvent._id)
                      }}>Decline Position</Button>
                    </div>
                    <Button variant="destructive" onClick={(e) => {
                      props.deleteEvent(selectedEvent._id)
                      setSelectedEvent(null)
                    }}>Delete Event</Button>
                  </div>
                </div>
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
  )
}
