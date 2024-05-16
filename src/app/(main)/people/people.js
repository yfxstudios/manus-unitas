import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"


export default function People(props) {
  'use client'
  return (
    <div className="flex flex-row">
      <div className="flex flex-col space-y-4 bg-base-300 sticky left-0 top-0 h-screen z-5 px-4 py-8">
        <h1 className="text-3xl font-semibold">{props.org.displayName}</h1>
        <Separator />
      </div>
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
                    <Button className="btn btn-primary">Edit</Button>
                    <Button className="btn btn-danger">Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="divider divider-horizontal h-1/2"></div>
      </div>
    </div>
  )
}