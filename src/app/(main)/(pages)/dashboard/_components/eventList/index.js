"use client";

import { getCurrentUser, getEvents, getUsers } from "@/app/actions";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { longDate } from "@/lib/util/date";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, UserRound, UserRoundCheck, UserRoundX, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";


const Component = ({ setSelectedEvent, selectedEvent, admin }) => {
  // events
  const {
    data: events,
    isSuccess: fetchedEvents,
    mutate,
  } = useMutation({
    mutationKey: "events",
    mutationFn: () => getEvents(),
  });

  // users
  const { data: users, isFetched: fetchedUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  // user
  const { data: user, isFetched: fetchedUser } = useQuery({
    queryKey: ["user"],
    queryFn: () => getCurrentUser(),
  });

  useEffect(() => {
    mutate();
  }, [selectedEvent]);



  if (!fetchedEvents || !fetchedUsers || !fetchedUser) {
    return (
      <>
        <Skeleton className="h-46 w-full" />
        <Skeleton className="h-46 w-full" />
        <Skeleton className="h-46 w-full" />
      </>
    );
  } else {
    const filteredEvents = events.filter(event => event.volunteers.map(user => user._id).includes(user._id))

    events.sort((a, b) => {
      if (a.date < b.date) {
        return -1;
      }
      if (a.date > b.date) {
        return 1;
      }
      return
    }).reverse().sort((a, b) => {
      if (a.startTime < b.startTime) {
        return -1;
      }
      if (a.startTime > b.startTime) {
        return 1;
      }
      return
    })

    return (
      <>
        {/* {fetchedEvents && fetchedUsers && fetchedUser && ( */}
        <div>
          {/* TODO: FIX WONT RERENDER */}
          {admin ? events.map(event => (
            <Card key={event._id} className="mb-4">
              <CardHeader>
                <CardTitle className="flex flex-row justify-between items-center">
                  <span className="text-wrap break-words hyphens-auto">
                    {event.title}
                  </span>
                  <div className="hidden xs:flex">
                    {event.accepted.includes(user._id) && (
                      <div className="flex flex-row items-center gap-2">
                        <p className="text-green-600 font-normal">Accepted</p>
                        <Check className="text-green-600" />
                      </div>
                    )}
                    {event.rejected.includes(user._id) && (
                      <div className="flex flex-row items-center gap-2">
                        <p className="text-red-600 font-normal">Declined</p>
                        <X className="text-red-600" />
                      </div>
                    )}
                  </div>
                </CardTitle>
                <CardDescription>{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-wrap break-words hyphens-auto">
                <p>{format(event.startTime, "PPP")}</p>
                <p>
                  {format(event.startTime, "hh:mm aaa")}{" to "}
                  {format(event.endTime, "hh:mm aaa")}
                </p>
                <div className="flex xs:hidden">
                  {event.accepted.includes(user._id) && (
                    <div className="flex flex-row items-center gap-2">
                      <p className="text-green-600 font-normal">Accepted</p>
                      <Check className="text-green-600" />
                    </div>
                  )}
                  {event.rejected.includes(user._id) && (
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
                  {user.admin && (
                    <div className="flex flex-row flex-wrap items-center gap-4 text-lg">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex flex-row items-center gap-2">
                              <UserRound />
                              <p>{event.volunteers.length}</p>
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
          ))
            : filteredEvents.map(event => (
              <Card key={event._id} className="mb-4">
                <CardHeader>
                  <CardTitle className="flex flex-row justify-between items-center">
                    <span className="text-wrap break-words hyphens-auto">
                      {event.title}
                    </span>
                    <div className="hidden xs:flex">
                      {event.accepted.includes(user._id) && (
                        <div className="flex flex-row items-center gap-2">
                          <p className="text-green-600 font-normal">Accepted</p>
                          <Check className="text-green-600" />
                        </div>
                      )}
                      {event.rejected.includes(user._id) && (
                        <div className="flex flex-row items-center gap-2">
                          <p className="text-red-600 font-normal">Declined</p>
                          <X className="text-red-600" />
                        </div>
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-wrap break-words hyphens-auto">
                  <p>{format(event.startTime, "PPP")}</p>
                  <p>
                    {format(event.startTime, "hh:mm aaa")}{" to "}
                    {format(event.endTime, "hh:mm aaa")}
                  </p>
                  <div className="flex xs:hidden">
                    {event.accepted.includes(user._id) && (
                      <div className="flex flex-row items-center gap-2">
                        <p className="text-green-600 font-normal">Accepted</p>
                        <Check className="text-green-600" />
                      </div>
                    )}
                    {event.rejected.includes(user._id) && (
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
                    {user.admin && (
                      <div className="flex flex-row flex-wrap items-center gap-4 text-lg">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex flex-row items-center gap-2">
                                <UserRound />
                                <p>{event.volunteers.length}</p>
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
            ))
          }
        </div>
        {/* )} */}
      </>
    );
  }
};

export default Component;
