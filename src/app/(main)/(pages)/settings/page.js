import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { UserRound } from 'lucide-react'
import React from 'react'

const Settings = () => {

  return (
    <div className="flex flex-col gap-2 px-36 py-16">
      <h1 className="text-2xl font-semibold">
        Settings
      </h1>
      <div className="flex flex-col gap-4">
        <Card className="w-96 flex flex-row items-center p-6 gap-4 cursor-pointer">
          <UserRound className="w-10 h-10" />
          <CardHeader className="flex-1 p-0">
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Update your profile settings
            </CardDescription>
          </CardHeader>
        </Card>


      </div >
    </div >

  )
}

export default Settings
