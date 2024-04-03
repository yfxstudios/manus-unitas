'use client'

import { useState } from "react";
import { signOut } from "next-auth/react";

import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


export default function Dashboard(props) {

  const [background, setBackground] = useState(false) //<----------------------------------------------------- Change this to true to see the background color change
  const [modalOpen, setModalOpen] = useState(0)
  const [loading, setLoading] = useState(false)

  const [selectedPeople, setSelectedPeople] = useState([])

  const [editingEvent, setEditingEvent] = useState(false)

  const [eventInfo, setEventInfo] = useState({
    title: "",
    date: "",
    description: "",
    volunteers: {}
  })

  const events = props.events;

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [users, setUsers] = useState(false)

  const [acceptedUsers, setAcceptedUsers] = useState([])
  const [declinedUsers, setDeclinedUsers] = useState([])

  const [menuOpen, setMenuOpen] = useState(false)



  const detailHandler = (id) => {
    // console.log(events)
    if (!id) {
      alert("No ID provided!")
    };
    const event = events.find((event) => event._id === id);
    if (!event) {
      alert("No event found with that ID!")
    } else {
      setSelectedEvent(event)
    }
  };

  const handleAccept = async (id) => {
    setLoading(true)
    await props.handleAccept(id).then(() => {
      // console.log("Accepted")
      setLoading(false)
    })
    setSelectedEvent(null)
  }

  const handleDecline = async (id) => {
    setLoading(true)
    await props.handleDecline(id).then(() => {
      // console.log("Declined")
      setLoading(false)
    })
    setSelectedEvent(null)

  }

  const logoutHandler = async () => {
    setLoading(true)

    await signOut();
    await props.logoutHandler().then(() => {
      setLoading(false)
    })
  }

  const openCreateEventModal = () => {
    setModalOpen(1)
    setBackground(true)
  }

  // filter events to be only ones with the user's username as a volunteer
  const filteredEvents = events.filter((event) => {
    if (event.volunteers[props.user.username]) {
      return event
    } else {
      return null
    }
  })


  return (
    <div className="flex flex-row items-center justify-center min-h-screen py-2">
      {loading &&
        <div className="w-full h-full fixed bg-primary-content bg-opacity-50" style={{ zIndex: 100 }}>
          <span className="loading loading-dots loading-lg text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
        </div>
      }

      <div className="w-full h-full fixed bg-primary-content bg-opacity-50" style={{ zIndex: 1, display: background ? "block" : "none" }}></div>
      <h2 className="text-2xl font-semibold absolute top-4 left-4 text-primary">{props.user.organization.displayName}</h2>
      <div className="absolute top-8 right-8 flex flex-row space-x-4 z-0">
        {/* <button className="btn btn-outline btn-primary" onClick={logoutHandler}>Logout</button> */}
        {/* check if user is an admin and if people.find users that have not been accepted and have not been declined */}
        {props.user.organization.admin && props.people.find((person) => !person.accepted && !person.declined) && (
          <button className="btn btn-info" onClick={() => {
            setModalOpen(4)
            setBackground(true)
          }}>Accept Users</button>
        )}
        <div className="cursor-pointer dropdown dropdown-left">
          <div tabIndex={0} role="button" className="btn bg-none">
            <AccountCircleIcon className="" />
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <a onClick={logoutHandler}>Logout</a>
            </li>
            <li>
              <a onClick={() => {
                setModalOpen(6)
                setBackground(true)

              }}>People</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-[35vw] mx-auto mt-8">
        <div className="flex flex-row items-center justify-between mb-4">
          <h2 className="text-lg font-semibold mb-4">My Schedule</h2>
          {props.user.organization.admin && (
            <>
              <button className="btn btn-primary" onClick={openCreateEventModal}>Create Event</button>

              {modalOpen === 1 && (
                <form className="flex flex-col space-y-4 text-primary-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl w-[40vw] z-10"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setModalOpen(2);
                    setEventInfo({
                      title: document.getElementById("name").value,
                      date: document.getElementById("date").value,
                      startTime: document.getElementById("time-start").value,
                      endTime: document.getElementById("time-end").value,
                      description: document.getElementById("description").value,

                      volunteers: selectedPeople.map((person) => ({ username: person.username, role: "volunteer", accepted: false, declined: false }))
                    })
                  }}>

                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" className="input text-neutral-content" />
                  <label htmlFor="date">Date</label>
                  <input type="date" id="date" className="input text-neutral-content" />
                  <label htmlFor="time">Time</label>
                  <div className="flex flex-row space-x-4 items-center">
                    <input type="time" id="time-start" className="input text-neutral-content" />
                    <span>to</span>
                    <input type="time" id="time-end" className="input text-neutral-content" />
                  </div>
                  <label htmlFor="description">Description</label>
                  <textarea id="description" className="input text-neutral-content p-2 h-[100px]" style={{ resize: "none" }}></textarea>
                  <button className="btn btn-primary" type="submit">Next</button>
                  <button className="btn btn-outline btn-error" onClick={(e) => {
                    setModalOpen(0)
                    setBackground(false)
                  }}>Cancel</button>
                </form>
              )}
              {modalOpen === 2 && (
                <form className="flex flex-col space-y-4 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl w-[40vw] z-10"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setModalOpen(3)
                    setEventInfo({
                      ...eventInfo,
                      // volunteers: selectedPeople.map((person) => ({ username: person.username, role: "volunteer", accepted: false, declined: false })) This but as an object
                      volunteers: selectedPeople.reduce((acc, person) => {
                        acc[person.username] = { username: person.username, role: "volunteer", accepted: false, declined: false }
                        return acc
                      }, {})
                    })
                  }}>
                  <h3 className="text-lg font-semibold">Select Volunteers</h3>

                  <ul>
                    {props.people.map((person) => (
                      <li key={person._id} className="flex items-center p-4 rounded-lg space-x-4">
                        <div className={`flex items-center border-b-[6px] cursor-pointer bg-gray-50 p-2 ${selectedPeople.includes(person) ? "border-success" : "border-neutral"}`}
                          onClick={(e) => {
                            if (selectedPeople.includes(person)) {
                              setSelectedPeople(selectedPeople.filter((p) => p !== person))
                            } else {
                              setSelectedPeople([...selectedPeople, person])
                            }
                            // console.log(selectedPeople)
                          }}>
                          <p className="text-primary-content"
                            onClick={(e) => {
                              if (selectedPeople.includes(person)) {
                                setSelectedPeople(selectedPeople.filter((p) => p !== person))
                              } else {
                                setSelectedPeople([...selectedPeople, person])
                              }
                              // console.log(selectedPeople)
                            }}

                          >{person.first_name} {person.last_name}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button className="btn btn-primary" type="submit">Next</button>
                </form>
              )}
              {modalOpen === 3 && (
                <form className="flex flex-col space-y-4 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl w-[40vw] z-10">
                  <h3 className="text-lg font-semibold">Review Event</h3>
                  <h4 className="font-semibold">Name:</h4>
                  <p>{eventInfo.title}</p>
                  <h4 className="font-semibold">Date:</h4>
                  <p>{eventInfo.date}</p>
                  <h4 className="font-semibold">Time:</h4>
                  <p>{eventInfo.startTime} to {eventInfo.endTime}</p>
                  <h4 className="font-semibold">Description:</h4>
                  <p>{eventInfo.description}</p>
                  <h4 className="font-semibold">Volunteers:</h4>
                  <ul>
                    {selectedPeople.map((person) => (
                      <li key={person._id} className="flex items-center p-4 rounded-lg space-x-4">
                        <div className="flex items-center border-b-[6px] cursor-pointer bg-gray-50 p-2">
                          <p className="text-primary-content">{person.first_name} {person.last_name}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button className="btn btn-primary" onClick={(e) => {
                    props.createEventHandler(eventInfo)
                    setModalOpen(0)
                    setBackground(false)
                    setEventInfo({
                      title: "",
                      date: "",
                      description: "",
                      volunteers: {}
                    })
                    setSelectedPeople(null)

                  }
                  }>Create Event</button>
                  <button className="btn btn-error" onClick={(e) => {
                    setModalOpen(1)
                  }}>Back</button>
                </form>
              )}
              {modalOpen === 4 && (
                <div className="flex flex-col space-y-4 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl w-[40vw] z-10">
                  <h3 className="text-lg font-semibold">Select Users to Accept or Decline</h3>
                  <ul>
                    {/* check if people.accepted is false */}
                    {props.people.filter((person) => !person.accepted && !person.declined).map((person) => (
                      <li key={person._id} className="flex items-center p-4 rounded-lg justify-between">
                        <p className="text-primary-content">{person.first_name} {person.last_name}</p>
                        <div className="flex space-x-4 items-center">
                          {acceptedUsers.includes(person) && <p className="text-success">Accepted</p>}
                          {declinedUsers.includes(person) && <p className="text-error">Declined</p>}
                          <button
                            className={`btn btn-primary ${acceptedUsers.includes(person) ? "btn-disabled" : ""}`}
                            onClick={(e) => {
                              setAcceptedUsers([...acceptedUsers, person])
                              setDeclinedUsers(declinedUsers.filter((p) => p !== person))
                            }}>Accept</button>
                          <button
                            className={`btn btn-error ${declinedUsers.includes(person) ? "btn-disabled" : ""}`}
                            onClick={(e) => {
                              setDeclinedUsers([...declinedUsers, person])
                              setAcceptedUsers(acceptedUsers.filter((p) => p !== person))
                            }}>Decline</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button className="btn btn-primary" onClick={(e) => {
                    setModalOpen(5)
                  }}>Review Users</button>
                  <button className="btn btn-error" onClick={(e) => {
                    setModalOpen(0)
                    setBackground(false)
                    setAcceptedUsers([])
                    setDeclinedUsers([])
                  }}>Cancel</button>
                </div>
              )}
              {modalOpen === 5 && (
                <form className="flex flex-col space-y-4 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl w-[40vw] z-10">
                  <h3 className="text-lg font-semibold">Review Users</h3>
                  <ul>
                    {acceptedUsers.map((person) => (
                      <div key={person._id} className="flex items-center justify-between m-4">
                        <p className="text-success">{person.first_name} {person.last_name}</p>
                        <h1 className="text-success text-lg">Accepted</h1>
                      </div>
                    ))}
                    {declinedUsers.map((person) => (
                      <div key={person._id} className="flex items-center justify-between m-4">
                        <p className="text-error">{person.first_name} {person.last_name}</p>
                        <h1 className="text-error text-lg">Declined</h1>
                      </div>
                    ))}
                  </ul>

                  <button className="btn btn-primary" onClick={(e) => {
                    acceptedUsers.forEach((person) => {
                      props.acceptUser(person._id, person.email)
                    })
                    declinedUsers.forEach((person) => {
                      props.declineUser(person._id, person.email)
                    })
                    setModalOpen(0)
                    setBackground(false)
                    setSelectedPeople([])
                  }}>Apply</button>
                  <button className="btn btn-error" onClick={(e) => {
                    setModalOpen(4)
                  }}>Back</button>
                </form>
              )}
              {modalOpen === 6 && (
                <div className="flex flex-col space-y-4 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl w-[40vw] z-10">
                  <div className="flex justify-between w-full">
                    <h3 className="text-lg font-semibold">People</h3>
                    <a>View All</a>
                  </div>
                  <ul>
                    {props.people.map((person) => (
                      <li key={person._id} className="flex items-center rounded-lg space-x-4 mb-4">
                        <div className="flex items-center w-full justify-between">
                          <p className="text-primary-content">{person.first_name} {person.last_name}</p>
                          <div className="flex space-x-4 items-center">
                            <button className="btn btn-primary" onClick={(e) => {
                              setModalOpen(7)
                              setSelectedPeople(person)
                            }}>View</button>
                            <button className="btn btn-error" onClick={(e) => {
                              setModalOpen(8)
                              setSelectedPeople(person)
                            }}>Delete</button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button className="btn btn-error" onClick={(e) => {
                    setModalOpen(0)
                    setBackground(false)
                  }}>Close</button>
                </div>
              )}
              {modalOpen === 7 && (
                <div className="flex flex-col space-y-4 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl w-[40vw] z-10">
                  <h3 className="text-lg font-semibold">Person</h3>
                  <p className="text-primary-content">Name: {selectedPeople.first_name} {selectedPeople.last_name}</p>
                  <p className="text-primary-content">Username: {selectedPeople.username}</p>
                  <p className="text-primary-content">Email: {selectedPeople.email}</p>
                  <p className="text-primary-content">Phone: {selectedPeople.phone}</p>
                  <button className="btn btn-error"
                    onClick={(e) => {
                      setModalOpen(6)
                    }}
                  >Back</button>
                </div>
              )}
              {modalOpen === 8 && (
                <div className="flex flex-col space-y-4 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl w-[40vw] z-10">
                  <h3 className="text-lg font-semibold">Delete Person</h3>
                  <p className="text-primary-content">Are you sure you want to delete {selectedPeople.first_name} {selectedPeople.last_name}?</p>
                  <button className="btn btn-error"
                    onClick={async (e) => {
                      setLoading(true)
                      const res = await props.deleteUserHandler(selectedPeople.email).then(() => {
                        setLoading(false)
                      })
                      if (res === 500) {
                        alert("An error occurred. Please try again later.")
                      }
                      setModalOpen(0)
                      setBackground(false)
                    }}
                  >Delete</button>
                  <button className="btn btn-primary"
                    onClick={(e) => {
                      setModalOpen(6)
                    }}
                  >Back</button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col space-y-4 text-primary-content">
          {filteredEvents.map((event) => (
            <div key={event._id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg space-x-4">
              <div>
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm">{event.date}</p>
                <p className="text-sm">{event.startTime} to {event.endTime}</p>
              </div>
              <div className="flex space-x-4 items-center">

                {events.find((e) => e._id === event._id).volunteers[props.user.username].accepted && (
                  <>
                    <p className="text-success">Accepted</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        detailHandler(event._id);
                      }}
                    >View Details</button>
                  </>
                )}
                {events.find((e) => e._id === event._id).volunteers[props.user.username].declined && (
                  <>
                    <p className="text-error">Declined</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        detailHandler(event._id);
                      }}
                    >View Details</button>
                  </>
                )}
                {!events.find((e) => e._id === event._id).volunteers[props.user.username].accepted && !events.find((e) => e._id === event._id).volunteers[props.user.username].declined && (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        detailHandler(event._id);
                      }}
                    >View Details</button>
                    <button
                      className="btn btn-success"
                      onClick={(e) => {
                        handleAccept(event._id);
                      }}
                    >Accept</button>
                    <button
                      className="btn btn-error"
                      onClick={(e) => {
                        handleDecline(event._id);
                        setSelectedEvent(event);
                      }}
                    >Decline</button>
                  </>
                )}
              </div>
            </div>
          ))
          }
          {!events.length === 0 && props.user.organization.admin && <p className="text-primary">All Events</p>}
          {props.user.organization.admin && (
            events.map((event) => (
              <div key={event._id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg space-x-4">
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm">{event.date}</p>
                  <p className="text-sm">{event.startTime} to {event.endTime}</p>
                </div>
                <div className="flex space-x-4 items-center">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      detailHandler(event._id);
                    }}
                  >View Details</button>
                  <button
                    className="btn btn-error"
                    onClick={async (e) => {
                      setLoading(true)
                      await props.deleteEvent(event._id).then(() => {
                        setLoading(false)
                      })
                    }}
                  >Delete Event</button>
                </div>
              </div>

            ))
          )}

          {events.length === 0 && <h1 className="text-center text-primary">No events found</h1>}


        </div>
      </div >
      <div className="w-[35vw] mx-auto mt-8">
        {selectedEvent ? (
          <div className="bg-white p-4 rounded-lg text-primary-content relative">
            <EditIcon className="absolute top-4 right-4 cursor-pointer" onClick={(e) => {
              if (editingEvent) {
                setEditingEvent(false)
                props.updateEvent(selectedEvent._id, {
                  title: document.getElementById("name").value,
                  date: document.getElementById("date").value,
                  startTime: document.getElementById("time-start").value,
                  endTime: document.getElementById("time-end").value,
                  description: document.getElementById("description").value,
                })
              } else {
                setEditingEvent(true)
              }

            }} />
            {!editingEvent ? (
              <>
                <h2 className="text-lg font-semibold">{selectedEvent.title}</h2>
                <p className="text-sm">{selectedEvent.date}</p>
                <p className="mb-4 text-sm">{selectedEvent.startTime} to {selectedEvent.endTime}</p>
                <p>{selectedEvent.description}</p>
                <div className="flex flex-col space-y-4 items-flex-start">
                  <h3 className="font-semibold mt-10">Volunteers</h3>
                  <ul>
                    {Object.values(selectedEvent.volunteers).map((volunteer) => (
                      <li key={volunteer.username} className="flex items-center justify-between p-2 rounded-lg">
                        <div className={`flex items-center border-b-[6px] bg-gray-50 p-2 ${volunteer.accepted ? "border-success" : volunteer.declined ? "border-error" : "border-neutral"}`}>
                          <p>{props.people.find((person) => person.username === volunteer.username).first_name} {props.people.find((person) => person.username === volunteer.username).last_name}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-4">
                <input type="text" defaultValue={selectedEvent.title} className="text-primary-content text-lg font-semibold outline-none bg-transparent border-b-2 border-primary-content w-[80%]" id="name" />
                <input type="date" defaultValue={selectedEvent.date} className="text-primary-content text-lg font-semibold outline-none bg-transparent border-b-2 border-primary-content w-[80%]" id="date" />
                <div className="flex flex-row space-x-4 items-center">
                  <input type="time" defaultValue={selectedEvent.startTime} className="text-primary-content text-lg font-semibold outline-none bg-transparent border-b-2 border-primary-content" id="time-start" />
                  <span>to</span>
                  <input type="time" defaultValue={selectedEvent.endTime} className="text-primary-content text-lg font-semibold outline-none bg-transparent border-b-2 border-primary-content" id="time-end" />
                </div>
                <textarea value={selectedEvent.description} className="text-primary-content text-lg font-semibold outline-none bg-transparent border-b-2 border-primary-content w-[80%] h-[100px]" style={{ resize: "none" }} id="description"></textarea>
              </div>
            )}
            {selectedEvent.volunteers[props.user.username] && (
              <div className="mt-4">
                <h3 className="font-semibold">Role: {selectedEvent.volunteers[props.user.username].role}</h3>
              </div>
            )}
            {selectedEvent.volunteers[props.user.username] && selectedEvent.volunteers[props.user.username].accepted ? (
              <div className="flex flex-row justify-between">
                <div className="flex space-x-4 mt-4">
                  <button className="btn btn-outline btn-primary btn-disabled" onClick={(e) => {
                    handleAccept(selectedEvent._id)
                    // e.target.classList.add("loading-spinner")
                    // e.target.classList.add("loading")
                  }}>Accept Position</button>
                  <button className="btn btn-outline btn-error" onClick={(e) => {
                    handleDecline(selectedEvent._id)
                    // e.target.classList.add("loading-spinner")
                    // e.target.classList.add("loading")
                  }}>Decline Position</button>
                </div>
                <button className="btn btn-error" onClick={async (e) => {
                  setLoading(true)
                  await props.deleteEvent(selectedEvent._id).then(() => {
                    setSelectedEvent(null)
                    setLoading(false)
                  })
                }}>Delete Event</button>
              </div>
            ) : (
              <div className="flex flex-row justify-between mt-4">
                <div className="space-x-4">
                  <button className="btn btn-primary btn-outline" onClick={(e) => {
                    handleAccept(selectedEvent._id)
                    // e.target.classList.add("loading-spinner")
                    // e.target.classList.add("loading")
                  }}>Accept Position</button>
                  <button className="btn btn-error btn-disabled" onClick={(e) => {
                    handleDecline(selectedEvent._id)
                    // e.target.classList.add("loading-spinner")
                    // e.target.classList.add("loading")
                  }}>Decline Position</button>
                </div>
                <button className="btn btn-error" onClick={(e) => {
                  props.deleteEvent(selectedEvent._id)
                  setSelectedEvent(null)
                }}>Delete Event</button>
              </div>

            )}
          </div>
        ) : (
          <p className="text-center">Select an event to view details</p>
        )}
      </div>
      <p className="absolute bottom-4 left-4 text-primary">{props.user.username}</p>
    </div >
  )
}
