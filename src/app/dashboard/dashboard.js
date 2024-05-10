'use client'

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

import { longDate } from "@/lib/util/date";
import { standardTime } from "@/lib/util/time";
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import { Gear, Users } from "@phosphor-icons/react";




export default function Dashboard(props) {
  const events = props.events
  const [background, setBackground] = useState(false) //<----------------------------------------------------- Change this to true to see the background color change
  const [modalOpen, setModalOpen] = useState(0)
  const [loading, setLoading] = useState(false)

  const [selectedPeople, setSelectedPeople] = useState([])

  const [editingEvent, setEditingEvent] = useState(false)

  const [eventInfo, setEventInfo] = useState({})

  const [newRole, setNewRole] = useState({})


  const [tutorial, setTutorial] = useState(props.user.completedTutorial ? false : true)




  // console.log(events)

  const [selectedEvent, setSelectedEvent] = useState(null);


  const [acceptedUsers, setAcceptedUsers] = useState([])
  const [declinedUsers, setDeclinedUsers] = useState([])

  const [roles, setRoles] = useState([])
  const [allRoles, setAllRoles] = useState([])
  const [selectedRole, setSelectedRole] = useState("")



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

  useEffect(() => {
    if (editingEvent) {
      setBackground(true)
    } else {
      setBackground(false)
    }
  }, [editingEvent])

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
      <div className="flex flex-col space-y-4 text-[white] bg-base-300 sticky left-0 top-0 w-1/6 h-screen z-5 px-4 py-8">
        <h1 className="text-3xl font-semibold">{props.userOrg.displayName}</h1>
        <div className="divider"></div>
        <div className={`flex flex-row space-x-4 items-center rounded-xl p-4 cursor-pointer transition-all ${selectedNavOption === "events" ? "bg-primary hover:bg-primary/85" : "bg-base-200 hover:bg-base-100"}`} onClick={(e) => { setSelectedNavOption("events") }}>
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
        <div className="divider"></div>

      </div>

      <div className="flex flex-row justify-center space-x-8 text-[white] w-full px-36 py-48">
        <div className="flex flex-col w-1/2 space-y-4">
          <div className="flex flex-row space-x-4 items-center">
            <h1 className="text-2xl font-semibold">Events</h1>
          </div>
          {events.map((event) => (
            <div className="flex flex-col space-y-4 shadow-lg rounded-xl p-4 bg-base-300 hover:scale-[1.03] transition-all cursor-pointer" onClick={(e) => {
              setSelectedEvent(event)
            }}>
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p>{longDate(event.date)}</p>
              <p>{standardTime(event.startTime)} to {standardTime(event.endTime)}</p>
              <p>{event.description}</p>
            </div>
          ))}
          <button className="btn btn-primary" onClick={(e) => {
            props.createEventHandler({
              title: "New Event",
              date: "2024-12-25",
              startTime: "00:00",
              endTime: "00:00",
              description: "Description",
              volunteers: [
                {
                  _id: props.user._id,
                }
              ],
              organization: props.userOrg._id
            })
          }}>Create Event</button>
        </div>
        <div className="divider divider-horizontal h-1/2"></div>
        <div className="flex flex-col w-1/2 space-y-4">
          <div className="flex flex-col space-y-4 rounded-xl">
            {/* more information about event */}
            <h1 className="text-2xl font-semibold">Event</h1>
            <div className="flex flex-col bg-base-300 rounded-xl relative">
              {loading && (
                <div className="flex justify-center items-center z-10 rounded-xl bg-black opacity-50 w-full h-full absolute p-0 m-0">
                  <div className="loading loading-dots text-accent size-16 p-0 m-0" />
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
                    <ul>
                      {selectedEvent.volunteers.map((volunteer) => (
                        <li key={volunteer.username} className="flex items-center justify-between p-2 rounded-lg">
                          <div className={`flex items-center border-b-[6px] bg-base-100 p-2 justify-between ${selectedEvent.accepted.includes(volunteer._id) ? "border-success" : selectedEvent.rejected.includes(volunteer._id) ? "border-error" : "border-neutral"}`}>
                            <p
                              className="text-[white]"
                            >
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
                      <button className="btn btn-outline btn-primary" onClick={(e) => {
                        handleAccept(selectedEvent._id)
                      }}>Accept Position</button>
                      <button className="btn btn-outline btn-error" onClick={(e) => {
                        handleDecline(selectedEvent._id)
                      }}>Decline Position</button>
                    </div>
                    <button className="btn btn-error" onClick={(e) => {
                      props.deleteEvent(selectedEvent._id)
                      setSelectedEvent(null)
                    }}>Delete Event</button>
                  </div>
                </div>
              ) : (
                <p className="m-4">Select an event to view details</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
