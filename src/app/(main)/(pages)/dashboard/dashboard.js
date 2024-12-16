"use client";

import { Suspense, useState } from "react";

// import { longDate } from "@/lib/util/date";
import { Button } from "@/components/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import FancyMultiSelect from "@/components/ui/multi-select";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import Loading from "../loading";
import EventList from "./_components/eventList";
import NewEventForm from "./_components/newEventForm";
import SelectedEvent from "./_components/selectedEvent";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Dashboard(props) {
  const router = useRouter();
  const roles = props.roles;
  const [loading, setLoading] = useState(false);

  const [e, setE] = useState();

  // console.log(events)

  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleAccept = async (id) => {
    setLoading(true);
    setSelectedEvent({
      _id: selectedEvent._id,
    });
    await props.handleAccept(id);
    setLoading(false);
    router.refresh();
  };

  const handleDecline = async (id) => {
    console.log(id);
    setLoading(true);
    setSelectedEvent(...selectedEvent, {
      volunteers: selectedEvent.volunteers.filter(
        (volunteer) => volunteer !== props.user._id
      ),
    });
    await props.handleDecline(id);
    setLoading(false);
  };

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [selected, setSelected] = useState([]);

  // combine duplicate volunteers
  // get all volunteers from each role.volunteers

  console.log("Selected", selected);

  // selected = [
  //     {
  //         "parent": "66848563b8e35040862eb3c5",
  //         "subRoles": [
  //             {
  //                 "child": "66848563b8e35040862eb3c6",
  //                 "volunteers": [
  //                     "66778b62759cf25fa81e677b"
  //                 ]
  //             }
  //         ]
  //     },
  //     {
  //         "parent": "66848563b8e35040862eb3c5",
  //         "subRoles": [
  //             {
  //                 "child": "66848563b8e35040862eb3c6",
  //                 "volunteers": [
  //                     "66778e8b759cf25fa81e6848"
  //                 ]
  //             }
  //         ]
  //     }
  // ]

  // should be combined to one object

  const combined = selected.reduce((acc, curr) => {
    const existing = acc.find((item) => item.parent === curr.parent);

    if (existing) {
      existing.subRoles = [...existing.subRoles, ...curr.subRoles];
    } else {
      acc.push(curr);
    }

    return acc;
  }, []);

  // combined = [
  //   {
  //     "parent": "66848563b8e35040862eb3c5",
  //     "subRoles": [
  //       {
  //         "child": "66848563b8e35040862eb3c6",
  //         "volunteers": [
  //           "66778b62759cf25fa81e677b"
  //         ]
  //       },
  //       {
  //         "child": "66848563b8e35040862eb3c6",
  //         "volunteers": [
  //           "66778e8b759cf25fa81e6848"
  //         ]
  //       },
  //       {
  //         "child": "66848563b8e35040862eb3c6",
  //         "volunteers": [
  //           "66778e8b759cf25fa81e6848"
  //         ]
  //       },
  //       {
  //         "child": "66848563b8e35040862eb3c6",
  //         "volunteers": [
  //           "66778e8b759cf25fa81e6848"
  //         ]
  //       },
  //       {
  //         "child": "66848563b8e35040862eb3c6",
  //         "volunteers": [
  //           "66778e8b759cf25fa81e6848"
  //         ]
  //       },
  //       {
  //         "child": "66848563b8e35040862eb3c6",
  //         "volunteers": [
  //           "66778e8b759cf25fa81e6848"
  //         ]
  //       },
  //       {
  //         "child": "66848563b8e35040862eb3c6",
  //         "volunteers": [
  //           "66778e8b759cf25fa81e6848"
  //         ]
  //       }
  //     ]
  //   }
  // ]

  // combine duplicate volunteers
  // eg. {
  //         "child": "66848563b8e35040862eb3c6",
  //         "volunteers": [
  //           "66778e8b759cf25fa81e6848"
  //         ]
  //       }
  // And
  //       {
  //         "child": "66848563b8e35040862eb3c6",
  //         "volunteers": [
  //           "66778e8b759cf25fa81e6848"
  //         ]
  //       }
  // should be one because they have the same child id and volunteers
  // const combineDuplicates = combined.subRoles.reduce((acc, curr) => {
  //   const existing = acc.find(
  //     item => item.child === curr.child
  //   );

  //   if (existing) {
  //     existing.volunteers = [
  //       ...existing.volunteers,
  //       ...curr.volunteers,
  //     ];
  //   } else {
  //     acc.push(curr);
  //   }

  // }, []);

  const combineVolunteers = combined.map((item) => {
    const subRoles = item.subRoles.reduce((acc, curr) => {
      const existing = acc.find((subRole) => subRole.child === curr.child);

      if (curr.volunteers.length === 0) {
        return acc;
      }

      if (existing) {
        // existing.volunteers = [...existing.volunteers, ...curr.volunteers]; // sometimes gives invalid array length
        existing.volunteers = [
          ...new Set([...existing.volunteers, ...curr.volunteers]),
        ];
      } else {
        acc.push(curr);
      }

      return acc;
    }, []);

    return {
      parent: item.parent,
      subRoles,
    };
  });

  // finally,
  // [
  //   {
  //     "parent": "66848563b8e35040862eb3c5",
  //       "subRoles": [
  //         {
  //           "child": "66848563b8e35040862eb3c6",
  //           "volunteers": [
  //             "66778b62759cf25fa81e677b",
  //             "66778e8b759cf25fa81e6848",
  //             "66778e8b759cf25fa81e6848",
  //             "66778e8b759cf25fa81e6848"
  //           ]
  //         }
  //       ]
  //   }
  // ]

  // the repeated volunteers should be removed: 66778e8b759cf25fa81e6848, 66778e8b759cf25fa81e6848, and 66778e8b759cf25fa81e6848
  // should be one

  const finalCombined = combineVolunteers.map((item) => {
    const subRoles = item.subRoles.map((subRole) => {
      const volunteers = [...new Set(subRole.volunteers)];
      return {
        child: subRole.child,
        volunteers,
      };
    });

    return {
      parent: item.parent,
      subRoles,
    };
  });

  console.log("COMBINED", finalCombined, combineVolunteers, combined, selected);

  let volunteers = []; // ["66778b62759cf25fa81e677b", "66778e8b759cf25fa81e6848"]

  finalCombined.forEach((item) => {
    item.subRoles.forEach((subRole) => {
      subRole.volunteers.forEach((volunteer) => {
        volunteers.push(volunteer);
      });
    });
  });

  // delete duplicates
  volunteers = [...new Set(volunteers)];

  console.log("VOLUNTEERS", volunteers);

  return (
    <div className="flex flex-row">
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
                  <DialogContent className="flex flex-row w-full max-w-3xl">
                    <div className="w-1/2">
                      <DialogHeader>
                        <DialogTitle>New Event</DialogTitle>
                        <DialogDescription>
                          Create a new event for your organization.
                        </DialogDescription>
                      </DialogHeader>
                      <NewEventForm
                        onSubmit={async (e) => {
                          await props.createEvent(e, finalCombined, volunteers);
                          setOpen(false);
                        }}
                      />
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setOpen(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                    </div>

                    <div className="w-1/2">
                      <h1 className="text-2xl font-semibold">Roles</h1>
                      {roles.map((role) => (
                        <table className="w-full" key={role._id}>
                          <tr>
                            <td>{role.name}</td>
                          </tr>
                          <tr>
                            <td>
                              {role.subRoles.map((subRole) => (
                                <div className="ml-4" key={subRole._id}>
                                  <Label>{subRole.name}</Label>
                                  <FancyMultiSelect
                                    data={props.users.map((user) => ({
                                      value: user._id,
                                      label: `${user.first_name} ${user.last_name}`,
                                    }))}
                                    placeholder="Select volunteers"
                                    value={selected}
                                    setValue={setSelected}
                                    parentId={role._id}
                                    roleId={subRole._id}
                                  />
                                </div>
                              ))}
                            </td>
                          </tr>
                        </table>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline">New Event</Button>
                  </SheetTrigger>
                  <SheetContent className="w-screen">
                    <ScrollArea className="h-full w-full p-0 xs:p-3">
                      <div className="xs:m-1">
                        <SheetHeader className="text-left">
                          <SheetTitle>New Event</SheetTitle>
                        </SheetHeader>

                        <div className="mt-4">
                          <h1 className="text-xl font-semibold">Roles</h1>
                          {roles.map((role) => (
                            <table className="w-full" key={role._id}>
                              <tr>
                                <td>{role.name}</td>
                              </tr>
                              <tr>
                                <td>
                                  {role.subRoles.map((subRole) => (
                                    <div className="ml-4" key={subRole._id}>
                                      <Label>{subRole.name}</Label>
                                      <FancyMultiSelect
                                        data={props.users.map((user) => ({
                                          value: user._id,
                                          label: `${user.first_name} ${user.last_name}`,
                                        }))}
                                        placeholder="Select volunteers"
                                        value={selected}
                                        setValue={setSelected}
                                        parentId={role._id}
                                        roleId={subRole._id}
                                      />
                                    </div>
                                  ))}
                                </td>
                              </tr>
                            </table>
                          ))}
                        </div>

                        <NewEventForm
                          onSubmit={async (e) => {
                            await props.createEvent(
                              e,
                              finalCombined,
                              volunteers
                            );
                            setOpen(false);
                          }}
                        />
                      </div>

                      <SheetFooter className="pt-2">
                        <SheetClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </SheetClose>
                      </SheetFooter>
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              )}
            </>
          )}

          <ScrollArea className="max-h-[calc(100vh-400px)] w-full">
            <Suspense fallback={<Loading />}>
              <EventList
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
                admin={props.user.admin}
              />
            </Suspense>
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
              <Suspense
                fallback={
                  <p className="text-lg">
                    Select an event to view more information.
                  </p>
                }
              >
                <SelectedEvent
                  selectedEvent={selectedEvent}
                  setSelectedEvent={setSelectedEvent}
                  handleAccept={handleAccept}
                  handleDecline={handleDecline}
                  deleteEvent={props.deleteEvent}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
