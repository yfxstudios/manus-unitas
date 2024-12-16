import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Users from '@/lib/schemas/userSchema'
import { Bell, Building, CreditCard, ShieldCheck, UserRound, Shield } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'



const Settings = async () => {
  const session = await getServerSession()
  const user = await Users.findOne({ email: session.user.email })

  console.log(user.organizationOwner)

  return (
    <div className="flex flex-col gap-2 px-4 md:px-36 py-16">
      <h1 className="text-2xl font-semibold">
        Settings
      </h1>
      <div className="flex flex-row flex-wrap gap-4">

        <Link href="/settings/profile" asChild className='w-fit'>
          <Card className="w-96 flex flex-row items-center p-6 gap-4">
            <UserRound className="w-10 h-10" />
            <CardHeader className="flex-1 p-0">
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your profile settings
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {user.admin && user.organizationOwner && (
          <Link href="/settings/organization" asChild className='w-fit'>
            <Card className="w-96 flex flex-row items-center p-6 gap-4">
              <Building className="w-10 h-10" />
              <CardHeader className="flex-1 p-0">
                <CardTitle>Organization</CardTitle>
                <CardDescription>
                  Update your organization settings
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        )}

        <Link href="/settings/security" asChild className='w-fit'>
          <Card className="w-96 flex flex-row items-center p-6 gap-4">
            <ShieldCheck className="w-10 h-10" />
            <CardHeader className="flex-1 p-0">
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Update your security settings
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/settings/notifications" asChild className='w-fit'>
          <Card className="w-96 flex flex-row items-center p-6 gap-4">
            <Bell className="w-10 h-10" />
            <CardHeader className="flex-1 p-0">
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Customize email notifications
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {user.admin && user.organizationOwner && (
          <Link href="/settings/billing" asChild className='w-fit'>
            <Card className="w-96 flex flex-row items-center p-6 gap-4">
              <CreditCard className="w-10 h-10" />
              <CardHeader className="flex-1 p-0">
                <CardTitle>Billing</CardTitle>
                <CardDescription>
                  Update your billing information
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        )}
      </div>

      {user.admin && (
        <div className="flex flex-row gap-4 mt-8">
          <Link href="/settings/roles" asChild className='w-fit'>
            <Card className="w-96 flex flex-row items-center p-6 gap-4">
              <Shield className="w-10 h-10" />
              <CardHeader className="flex-1 p-0">
                <CardTitle>Roles</CardTitle>
                <CardDescription>
                  Manage user roles
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      )}
    </div>

  )
}

export default Settings
