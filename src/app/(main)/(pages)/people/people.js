'use client'

import { Button } from "@/components/ui/button"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import EditUserForm from "./_components/editUserForm"
import { useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"


export default function People(props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex flex-row">
      <div className="flex flex-row justify-center space-x-8 w-full px-36 py-48">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row space-x-4 items-center justify-between">
            <h1 className="text-2xl font-semibold">People</h1>
            <Button className="btn btn-primary">Add Person</Button>
          </div>

          <div className="flex flex-col bg-base-300 rounded-xl relative">

            <div className="flex flex-col space-y-4">
              {props.users.map((user) => (
                <div key={user._id} className="flex flex-row space-x-4 items-center">
                  <div className="flex flex-row gap-6">
                    <div className="h-12 w-12 bg-secondary rounded-full"></div>
                    <div className="flex flex-col mr-8">
                      <h1 className="text-lg font-semibold">{user.first_name} {user.last_name}</h1>
                      <p className="text-sm">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-row space-x-4 items-center">
                    <Drawer open={isOpen} onOpenChange={setIsOpen}>
                      <DrawerTrigger asChild>
                        <Button variant="outline">Edit</Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <div className="mx-auto w-full max-w-md">
                          <DrawerHeader>
                            <DrawerTitle>
                              {user.first_name} {user.last_name}
                            </DrawerTitle>
                            <DrawerDescription>
                              {user.email}
                            </DrawerDescription>
                          </DrawerHeader>

                          <div className="p-2 pb-0">
                            <EditUserForm user={user} handleSubmit={async (data, uid) => {
                              await props.onEditUser(data, uid)
                              // close drawer
                              setIsOpen(false)
                            }} />
                          </div>


                          <DrawerFooter>
                            {/* <Button>Submit</Button> */}
                            <DrawerClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </div>
                      </DrawerContent>
                    </Drawer>


                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          {...user.email === props.user.email && { disabled: true }}
                        >
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="sm:justify-start">
                          <DialogClose asChild>
                            <div className="flex flex-row gap-4 items-center">
                              <Button variant="outline">Cancel</Button>
                              <Button variant="destructive"
                                onClick={() => {
                                  props.onDeleteUser(user._id)
                                }}
                              >Delete</Button>
                            </div>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>

                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}