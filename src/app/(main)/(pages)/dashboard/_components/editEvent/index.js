import { getRoles, updateEvent } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import FancyMultiSelect from "@/components/ui/multi-select";
import { longDate } from "@/lib/util/date";
import { standardTime } from "@/lib/util/time";
import { useQuery } from "@tanstack/react-query";
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
        volunteers.push(volunteer._id);
      });
    });
  });

  volunteers = [...new Set(volunteers)];


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between items-center">
          <div className="flex-1 text-wrap break-words hyphens-auto">
            {event.title}
          </div>
        </CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent className="text-wrap break-words hyphens-auto text-sm xs:text-base">
        <p>{longDate(event.date)}</p>
        <p>
          {standardTime(event.startTime)} to {standardTime(event.endTime)}
        </p>
        <br />
        <div className="flex flex-col space-y-4">
          {data.map(role => (
            <Card key={role._id}>
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
          <Button
            onClick={() => {
              updateEvent(event._id, {
                $set: {
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
