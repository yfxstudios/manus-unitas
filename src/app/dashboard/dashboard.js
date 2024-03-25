'use client'

import { useState } from "react";

export default function dashboard(props) {
  const events = props.events;

  const [selectedEvent, setSelectedEvent] = useState(null);


  const detailHandler = (id) => {
    // find id of event in database
    // fetch event details

    fetch(`/api/events/${id}`)
  };

  const handleAccept = (id) => {
    alert("Position accepted!" + selectedEvent.title);
  }

  const handleDecline = () => {
    alert("Position declined!");
  }


  return (
    <div className="flex flex-row items-center justify-center min-h-screen py-2">
      <input id="name" type="text" className="input input-primary w-[35vw] mx-auto" placeholder="Enter your name" />
      <div className="w-[35vw] mx-auto mt-8">
        <h2 className="text-lg font-semibold mb-4">My Schedule</h2>
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
                    detailHandler(event.title);
                  }}
                >View Details</button>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    setSelectedEvent(event);
                    handleAccept();
                  }}
                >Accept</button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setSelectedEvent(event);
                    handleDecline();
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
              <button className="btn btn-outline btn-primary" onClick={handleAccept}>Accept Position</button>
              <button className="btn btn-outline btn-danger" onClick={handleDecline}>Decline Position</button>
            </div>
          </div>
        ) : (
          <p className="text-center">Select an event to view details</p>
        )}
      </div>
    </div>
  )
}
