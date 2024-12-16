"use client";
import React from "react";
import { getEvents, getRoles } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { Plus, X } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteRole } from "../../roleActions";
import Image from "next/image";

const RolesList = ({ orgId }) => {
  const [editingRole, setEditingRole] = React.useState(null);

  const { data, isSuccess } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getRoles(orgId),
  });

  console.log(data);

  return (
    <div className="w-full">
      {isSuccess ? (
        <>
          {data.length > 0 && <h1 className="text-4xl font-semibold">Roles</h1>}
          {data.map((role) => (
            <>
              {editingRole && editingRole._id === role._id ? (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <Input
                        type="text"
                        className="text-2xl font-semibold"
                        value={role.name}
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {role.subRoles.map((subRole, roleIndex) => (
                      <div
                        className="flex flex-row gap-2 items-center"
                        key={subRole._id}
                      >
                        <Input
                          type="text"
                          className="mb-1"
                          value={subRole.name}
                          onChange={(e) => {
                            role.subRoles[roleIndex].name = e.target.value;
                            setEditingRole({ ...role });
                          }}
                          maxLength={30}
                        />
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            role.subRoles.splice(roleIndex, 1);
                            setEditingRole({ ...role });
                          }}
                        >
                          <X size={16} />
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="link"
                      onClick={() => {
                        role.subRoles.push({ name: "" });

                        setEditingRole({ ...role });
                      }}
                    >
                      + Add Sub Role
                    </Button>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingRole(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={async () => {
                        setEditingRole(null);
                        await updateRole(role);
                        mutate();
                      }}
                    >
                      Save
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card key={role._id} className="w-96">
                  <CardHeader>
                    <CardTitle>{role.name}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="flex flex-col gap-2">
                      {role.subRoles.map((subRole) => (
                        <span key={subRole._id}>{subRole.name}</span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setEditingRole(role)}
                        variant="outline"
                      >
                        Edit
                      </Button>
                      <Dialog>
                        <DialogTrigger disabled>
                          <Button variant="destructive" disabled>
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Role</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this role?
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              onClick={async () => {
                                // await deleteRole(role);
                              }}
                              variant="destructive"
                            >
                              Yes
                            </Button>
                            <DialogClose asChild>
                              <Button>No</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardFooter>
                </Card>
              )}
            </>
          ))}
          {data.length === 0 && (
            <div className="flex flex-col items-center justify-center w-full md:pt-32 gap-2">
              <Image
                src="/no-roles.png"
                width={500}
                height={500}
                alt={"Add your first role!"}
              />
              <h1 className="text-4xl font-semibold">Create your first role</h1>
              <p className="text-gray-500">
                Roles promote organization and clarity for your team
              </p>
              <Button variant="outline" className="gap-1">
                Create Role <Plus size={16} />
              </Button>
            </div>
          )}
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default RolesList;
