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
import { Mail, MessageCircle, MessageSquareMore, Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollAreaHorizontal } from "@/components/ui/scroll-area-horizontal"
import NewUserForm from "./_components/newUserForm"
import { useMediaQuery } from "@uidotdev/usehooks"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AvatarImage } from "@radix-ui/react-avatar"
import { sendMail } from "@/app/mail"


export default function People(props) {
  const [open, setOpen] = useState("") // user emails that's drawer is open

  const [addUserMenuOpen, setAddUserMenuOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <div className="flex flex-row">
      <div className="flex flex-row justify-center space-x-8 w-full px-8 py-16 lg:py-48">
        <div className="flex flex-col space-y-4 w-full max-w-2xl">
          <div className="flex flex-row space-x-4  items-center justify-between">
            <h1 className="text-2xl font-semibold">People</h1>

          </div>

          <div className="flex flex-col bg-base-300 rounded-xl relative">
            <ScrollAreaHorizontal className="w-full whitespace-nowrap">
              <div className="flex flex-col gap-4 w-full">
                {props.users.map((user) => (
                  <div key={user._id} className="flex flex-row space-x-4 items-center">
                    <div className="flex flex-row w-full gap-6 items-center justify-between">
                      <div className="flex flex-row gap-6 items-center" >
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.first_name} />
                          <AvatarFallback>
                            {user.first_name[0]}
                            {user.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col mr-8">
                          <h1 className="text-lg font-semibold">{user.first_name} {user.last_name}</h1>
                          <p className="text-sm">{user.email}</p>
                        </div>
                      </div>
                      {user.completedSignup ? (
                        <div className="flex flex-row gap-6 items-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <a href={`sms:${user.phone}`} className="flex flex-row gap-4 items-center">
                                  <MessageSquareMore className="cursor-pointer" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{user.phone}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <a href={`mailto:${user.email}`} className="flex flex-row gap-4 items-center">
                                  <Mail className="cursor-pointer" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{user.email}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ) : (
                        <p>User has not completed signup</p>
                      )}
                    </div>

                    {props.user.admin && user.completedSignup && (
                      <div className="flex flex-row space-x-4 items-center">
                        <Drawer open={open === user.email} onOpenChange={(isOpen) => {
                          if (isOpen) {
                            setOpen(user.email)
                          } else {
                            setOpen("")
                          }
                        }}>
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
                                  setOpen("")
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
                    )}
                  </div>
                ))}
                {props.user.admin && (
                  <>
                    {isDesktop ? (
                      <Dialog open={addUserMenuOpen} onOpenChange={setAddUserMenuOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline"><Plus /> Add Person</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Add a person</DialogTitle>
                            <DialogDescription>
                              Add a new person to your organization.
                            </DialogDescription>
                          </DialogHeader>
                          <NewUserForm
                            handleSubmit={async e => {
                              const res = await props.createPartialUser(e)
                              return res
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Drawer open={addUserMenuOpen} onOpenChange={setAddUserMenuOpen}>
                        <DrawerTrigger asChild>
                          <Button variant="outline"><Plus /> Add Person</Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader className="text-left">
                            <DrawerTitle>Add a person</DrawerTitle>
                            <DrawerDescription>
                              Add a new person to your organization.
                            </DrawerDescription>
                          </DrawerHeader>
                          <NewUserForm className="px-4"
                            handleSubmit={async e => {
                              const res = await props.createPartialUser(e)
                              if (res) {
                                return res
                              }
                              setAddUserMenuOpen(false)
                            }}
                          />
                          <DrawerFooter className="pt-2">
                            <DrawerClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    )}
                  </>
                )}
              </div>
            </ScrollAreaHorizontal>
          </div>
        </div>
      </div>
    </div>
  )
}