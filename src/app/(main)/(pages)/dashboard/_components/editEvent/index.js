import { getRoles, updateEvent } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FancyMultiSelect from "@/components/ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimePicker12 } from "@/components/ui/time-picker-12h";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { add, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React from "react";

const EditEvent = ({ event, setEditing, users, mutate }) => {
  const [selected, setSelected] = React.useState(
    event.roles.map(role => ({
      parent: role.parent._id,
      subRoles: role.subRoles.map(subRole => ({
        child: subRole.child._id,
        volunteers: subRole.volunteers.map(volunteer => volunteer._id),
      })),
    }))
  );

  const [title, setTitle] = React.useState(event.title);
  const [description, setDescription] = React.useState(event.description);



  const [startTime, setStartTime] = React.useState(event.startTime);

  const [endTime, setEndTime] = React.useState(event.endTime);

  const handleSelect = (newDay) => {
    if (!newDay) return;
    if (!startTime) {
      setStartTime(newDay);
      return;
    }
    const diff = newDay.getTime() - startTime.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(startTime, { days: Math.ceil(diffInDays) });
    setStartTime(newDateFull);
  };


  const { data, isFetched } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getRoles(event.organizationId),
  });

  if (!isFetched) {
    return <p>Fetching roles...</p>;
  }

  const combined = selected.reduce((acc, curr) => {
    const existing = acc.find(item => item.parent === curr.parent);

    if (existing) {
      existing.subRoles = [...existing.subRoles, ...curr.subRoles];
    } else {
      acc.push(curr);
    }

    return acc;
  }, []);

  const combineVolunteers = combined.map(item => {
    const subRoles = item.subRoles.reduce((acc, curr) => {
      const existing = acc.find(subRole => subRole.child === curr.child);

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

  const finalCombined = combineVolunteers.map(item => {
    const subRoles = item.subRoles.map(subRole => {
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

  let volunteers = [];

  finalCombined.forEach(item => {
    item.subRoles.forEach(subRole => {
      subRole.volunteers.forEach(volunteer => {
        volunteers.push(volunteer);
      });
    });
  });

  volunteers = [...new Set(volunteers)];

  console.log(volunteers)


  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="flex flex-row justify-between items-center">
          <div className="flex-1 text-wrap break-words hyphens-auto">
            <Input value={title} onChange={e => setTitle(e.target.value)}
              className="text-2xl"
            />
          </div>
        </CardTitle>
        <CardDescription>
          <Input value={description} onChange={e => setDescription(e.target.value)} />
        </CardDescription>
      </CardHeader>
      <CardContent className="text-wrap break-words hyphens-auto text-sm xs:text-base">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "min-w-[280px] justify-start text-left font-normal",
                !startTime && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
              {startTime && endTime
                ? `${format(startTime, `PPP h:mm a`)} - ${format(endTime, "h:mm a")}`
                : "Select Date & Time"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto">
            <Calendar
              mode="single"
              selected={startTime}
              onSelect={(d) => handleSelect(d)}
              disabled={(d) => d < new Date().setHours(0, 0, 0, 0)}
              initialFocus
            />
            {/* <TimePicker12 setDate={setStartTime} date={startTime} />
              <TimePicker12 setDate={setEndTime} date={endTime} noLabel /> */}
            <div className="p-3 border-t border-border w-fit flex flex-row gap-3">
              <div
                className={cn(
                  "flex flex-col text-left justify-around w-full text-sm text-muted-foreground"
                )}
              >
                <p>
                  Start
                </p>
                <p>
                  End
                </p>
              </div>
              <div>
                <Input type="time"
                  value={format(startTime, "HH:mm")}
                  onChange={e => {
                    let [hours, minutes] = e.target.value.split(":");

                    setStartTime(new Date(startTime.setHours(hours, minutes)));
                  }}
                />

                <Input type="time"
                  value={format(endTime, "HH:mm")}
                  onChange={e => {
                    let [hours, minutes] = e.target.value.split(":");
                    setEndTime(new Date(endTime.setHours(hours, minutes)))
                  }}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <div className="flex flex-col">
          {data.map(role => (
            <Card key={role._id}
              className="mt-4"
            >
              <CardHeader className="pb-0">
                <CardTitle>{role.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full mt-2" key={role._id}>
                  <tr>
                    <td>
                      {role.subRoles.map(subRole => (
                        <div className="ml-4" key={subRole._id}>
                          <Label>{subRole.name}</Label>
                          <FancyMultiSelect
                            data={users.map(user => ({
                              value: user._id,
                              label: `${user.first_name} ${user.last_name}`,
                            }))}
                            users={users}
                            placeholder="Select volunteers"
                            value={selected}
                            setValue={setSelected}
                            parentId={role._id}
                            roleId={subRole._id}
                            defaultValue={
                              finalCombined.find(
                                item => item.parent === role._id
                              ) &&
                              finalCombined.find(
                                item => item.parent === role._id
                              ).subRoles.find(
                                subRoleItem => subRoleItem.child === subRole._id
                              ) &&
                              finalCombined.find(
                                item => item.parent === role._id
                              ).subRoles.find(
                                subRoleItem => subRoleItem.child === subRole._id
                              ).volunteers
                            }
                          />
                        </div>
                      ))}
                    </td>
                  </tr>
                </table>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-row justify-end">
        <div className="flex flex-row flex-wrap gap-4">
          <Button variant="outline" onClick={() => setEditing(false)}>
            Exit Edit Mode
          </Button>
          {/* TODO: ADD CONFIRMATION DIALOG */}

          <Button
            onClick={() => {
              updateEvent(event._id, {
                $set: {
                  title: title,
                  description: description,
                  startTime: startTime,
                  endTime: endTime,
                  roles: finalCombined,
                  volunteers: volunteers,
                }
              }, volunteers)
              setEditing(false)
              mutate()
            }}
          >
            Save
          </Button>
        </div>
      </CardFooter>
    </Card >
  );
};

export default EditEvent;
