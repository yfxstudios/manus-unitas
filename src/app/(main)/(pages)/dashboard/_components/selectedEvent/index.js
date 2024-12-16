import {
  getCurrentUser,
  getEvent,
  getUsers,
  handleAccept,
  handleDecline,
  incrementTime,
} from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import EditEvent from "../editEvent";
import { Badge } from "@/components/ui/badge";

const SelectedEvent = ({ selectedEvent, setSelectedEvent, deleteEvent }) => {
  const [editing, setEditing] = useState(false)

  const getAllUsers = async () => {
    // get the volunteers for each role
    const orgUsers = await getUsers()
    setOrgUsers(orgUsers)
  }
  const [orgUsers, setOrgUsers] = useState([])

  useEffect(() => {
    getAllUsers()

  }, [])

  const { data, isSuccess, mutate } = useMutation({
    mutationKey: "event",
    mutationFn: () => getEvent(selectedEvent._id),
  });

  useEffect(() => {
    mutate();
  }, [selectedEvent]);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (id && !selectedEvent) {
      setSelectedEvent({ _id: id });
    }
  }, [id]);


  const { data: users, isFetched: usersFetched } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const { data: user, isFetched: userFetched } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  const onAccept = async id => {
    await handleAccept(id);

    incrementTime(user._id, id, true);

    setSelectedEvent({
      ...selectedEvent,
      accepted: [...selectedEvent.accepted, user._id],
    });

    mutate();
  };

  const onDecline = async id => {
    await handleDecline(id);

    incrementTime(user._id, id, false);

    setSelectedEvent({
      ...selectedEvent,
      rejected: [...selectedEvent.rejected, user._id],
    });

    mutate();
  };

  const onDelete = async id => {
    users.forEach(volunteer => {
      if (selectedEvent.accepted.includes(volunteer._id))
        incrementTime(volunteer._id, id, false);
      if (selectedEvent.rejected.includes(volunteer._id))
        incrementTime(volunteer._id, id, true);
    });

    await deleteEvent(id);

    setSelectedEvent(null);

    mutate();
  };

  if (!selectedEvent) return <p>Select an event to view more information</p>;

  // users will be displayed in a table
  // Parent Role
  // -----------
  // Child Role: [Volunteer Name(s)]
  // Child Role: [Volunteer Name(s)]
  // Child Role: [Volunteer Name(s)]





  // roles: [
  // {
  //   parent: {
  //     type: mongoose.Types.ObjectId,
  //       ref: Roles,
  //     },
  //   subRoles: [
  //     {
  //       child: {
  //         type: mongoose.Types.ObjectId,
  //         ref: Roles,
  //       },
  //       volunteers: [
  //         {
  //           type: mongoose.Types.ObjectId,
  //           ref: Users,
  //         }
  //       ]
  //     }
  //   ]
  // }
  // ],

  if (!data || !usersFetched || !userFetched) {
    return <p>Loading...</p>;
  } else if (editing) {
    return (
      <EditEvent
        event={data.event}
        setEditing={setEditing}
        users={orgUsers}
        mutate={mutate}
      />
    )
  }


  if (data.event.volunteers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            No volunteers have been assigned to this event yet.
          </CardTitle>
        </CardHeader>
        <CardContent
          className="flex flex-row gap-2"
        >
          <Button onClick={e => {
            setEditing(true);
          }}>
            Edit Event
          </Button>
          <Button
            variant="destructive"
            onClick={e => {
              onDelete(data.event._id);
            }}
          >
            Delete Event
          </Button>

        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {isSuccess && usersFetched && userFetched && data && (
        <>
          {data && (
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-row justify-between items-center">
                  <div className="flex-1 text-wrap break-words hyphens-auto">
                    {data.event.title}
                  </div>
                </CardTitle>
                <CardDescription>{data.event.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-wrap break-words hyphens-auto text-sm xs:text-base">
                <p>{format(data.event.startTime, "PPP")}</p>
                <p>
                  {format(data.event.startTime, "hh:mm aaa")} to{" "}
                  {format(data.event.endTime, "hh:mm aaa")}
                </p>
                <br />
                <div className="flex flex-col space-y-4">
                  {data.event.roles.map(role => {
                    if (role.subRoles.length > 0) {
                      return (
                        <Card key={role.parent._id}>
                          <CardHeader
                            className="pb-0"
                          >
                            <CardTitle>
                              <h1
                                className="text-xl p-0 m-0 font-semibold"
                              >{role.parent.name}</h1>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-col gap-2">
                              {role.subRoles.map(subRole => {
                                return (
                                  <div key={subRole.child._id}>
                                    <p className="font-semibold my-2">
                                      {subRole.child.name}
                                    </p>
                                    <div className="flex flex-col space-y-2">
                                      {subRole.volunteers.map(volunteer => {
                                        return (
                                          <div
                                            key={volunteer._id}
                                            className="flex flex-row items-center gap-2"
                                          >
                                            <TooltipProvider>
                                              <Tooltip
                                                delayDuration={100}
                                              >
                                                <TooltipTrigger>
                                                  <Avatar
                                                    className={cn("border-gray-400 border-2", {
                                                      "border-green-500": data.event.accepted.includes(volunteer._id),
                                                      "border-destructive": data.event.rejected.includes(volunteer._id),
                                                    })}
                                                  >
                                                    <AvatarFallback
                                                      className="border-primary-foreground border-2"

                                                    >
                                                      {volunteer.first_name[0]}{volunteer.last_name[0]}

                                                    </AvatarFallback>
                                                    <AvatarImage
                                                      src={volunteer.avatar}
                                                      alt={volunteer.name}
                                                      className="border-primary-foreground border-2"
                                                    />
                                                  </Avatar>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  <p>
                                                    {data.event.accepted.includes(volunteer._id) ? "Accepted" : data.event.rejected.includes(volunteer._id) ? "Declined" : "Pending"}
                                                  </p>
                                                </TooltipContent>
                                              </Tooltip>
                                            </TooltipProvider>
                                            <p>{volunteer.first_name} {volunteer.last_name}</p>  {volunteer._id === user._id && <Badge variant="outline">YOU</Badge>}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    }
                  }
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-row justify-end">
                <div className="flex flex-row flex-wrap gap-4">
                  {data.event.volunteers.includes(user._id) && (
                    <>
                      <Button
                        disabled={data.event.accepted.includes(user._id)}
                        onClick={e => {
                          onAccept(data.event._id);
                        }}
                      >
                        Accept Position
                      </Button>
                      <Button
                        disabled={data.event.rejected.includes(user._id)}
                        onClick={e => {
                          onDecline(data.event._id);
                        }}
                      >
                        Decline Position
                      </Button>
                    </>
                  )}
                  {user.admin && (
                    <>
                      <Button onClick={e => {
                        setEditing(true);
                      }}>
                        Edit Event
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={e => {
                          onDelete(data.event._id);
                        }}
                      >
                        Delete Event
                      </Button>
                    </>
                  )}
                </div>
              </CardFooter>
            </Card>
          )}
        </>
      )}
    </>
  );
};

export default SelectedEvent;
