'use client'

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function dashboard(props) {
  const [background, setBackground] = useState(false) //<----------------------------------------------------- Change this to true to see the background color change
  const [modalOpen, setModalOpen] = useState(0)
  const events = props.events;

  const [selectedEvent, setSelectedEvent] = useState(null);

  // console.log(props.user.organization.admin) // true






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

  const handleAccept = (id) => {
    props.handleAccept(id);
  }

  const handleDecline = (id) => {
    props.handleDecline(id);
  }

  const logoutHandler = () => {
    signOut();
    props.logoutHandler();
  }

  const createEventHandler = (event) => {
    console.log(event)
    props.createEventHandler(event);
    setBackground(true)
    setModalOpen(1)
  }



  return (
    <div className="flex flex-row items-center justify-center min-h-screen py-2">
      {/*{background && <div style={{ zIndex: 1 }} className="w-full h-full absolute bg-opacity-50" />}*/}
      <div className="w-full h-full fixed bg-primary-content bg-opacity-50" style={{ zIndex: 0, display: background ? "block" : "none" }}></div>
      <h2 className="text-2xl font-semibold absolute top-4 left-4 text-primary">{props.user.organization.displayName}</h2>
      <button className="absolute top-4 right-4 btn btn-outline btn-primary" onClick={logoutHandler}>Logout</button>
      <div className="w-[35vw] mx-auto mt-8">
        <div className="flex flex-row items-center justify-between mb-4">
          <h2 className="text-lg font-semibold mb-4">My Schedule</h2>
          {props.user.organization.admin && (
            <>
              <button className="btn btn-primary" onClick={createEventHandler}>Create Event</button>

              {modalOpen === 1 && (
                <form className="flex flex-col space-y-4 text-primary-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg" onSubmit={(e) => {
                  e.preventDefault();
                  createEventHandler({
                    title: document.getElementById("name").value,
                    date: document.getElementById("date").value,
                    description: document.getElementById("description").value
                  });
                }}>

                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" className="input text-neutral-content" />
                  <label htmlFor="date">Date</label>
                  <input type="date" id="date" className="input text-neutral-content" />
                  <label htmlFor="description">Description</label>
                  <textarea id="description" className="input text-neutral-content p-2"></textarea>
                  <button className="btn btn-primary" type="submit">Next</button>
                </form>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col space-y-4 text-primary-content">

          {events.map((event) => (
            <div key={event._id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg space-x-4">
              <div>
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm">{event.date}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    detailHandler(event._id);
                  }}
                >View Details</button>
                <button
                  className="btn btn-success"
                  onClick={(e) => {
                    setSelectedEvent(event);
                    handleAccept(event._id);
                    // e.target.classList.add("loading-spinner")
                    // e.target.classList.add("loading")
                  }}
                >Accept</button>
                <button
                  className="btn btn-danger"
                  onClick={(e) => {
                    setSelectedEvent(event);
                    handleDecline(event._id);
                    // e.target.classList.add("loading-spinner")
                    // e.target.classList.add("loading")
                  }}
                >Decline</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-[35vw] mx-auto mt-8">
        {selectedEvent ? (
          <div className="bg-white p-4 rounded-lg text-primary-content">
            <h2 className="text-lg font-semibold">{selectedEvent.title}</h2>
            <p className="mb-4 text-sm">{selectedEvent.date}</p>
            <p>{selectedEvent.description}</p>
            {selectedEvent.role && (
              <div className="mt-4">
                <h3 className="font-semibold">Role: {selectedEvent.volunteers.Matthew.role}</h3>
              </div>
            )}
            <div className="flex space-x-4 mt-4">
              <button className="btn btn-outline btn-primary" onClick={(e) => {
                handleAccept(selectedEvent._id)
                // e.target.classList.add("loading-spinner")
                // e.target.classList.add("loading")
              }}>Accept Position</button>
              <button className="btn btn-outline btn-danger" onClick={(e) => {
                handleDecline(selectedEvent._id)
                // e.target.classList.add("loading-spinner")
                // e.target.classList.add("loading")

              }}>Decline Position</button>
            </div>
          </div>
        ) : (
          <p className="text-center">Select an event to view details</p>
        )}
      </div>
    </div>
  )
}
