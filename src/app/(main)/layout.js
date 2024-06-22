import React from "react";

import Sidebar from '@/components/sidebar';
import InfoBar from "@/components/infobar";
import { getServerSession } from "next-auth";
import Users from "@/lib/schemas/userSchema";
import Subscription from "@/lib/schemas/subscriptionSchema";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";
import SignOutButton from "@/components/sign-out-button";

const Layout = async ({ children }) => {
  const session = await getServerSession()
  const user = await Users.findOne({ email: session.user.email }).lean()
  const subscription = await Subscription.findOne({ organizationId: user.organizationId }).lean()


  if (!user) {
    signOut({
      callbackUrl: "/signin",
    })
    return null
  }

  if (user.admin) {
    if (!subscription) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-3xl font-bold">Subscription Required</h1>
          <p className="text-lg">Please subscribe to access this page</p>
          <Button className="mt-4" asChild>
            <a href="/subscribe">Subscribe</a>
          </Button>
        </div>
      )
    } else if (subscription.status !== 'active') {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-3xl font-bold">Subscription Required</h1>
          <p className="text-lg">Please subscribe to access this page</p>
          <Button className="mt-4" asChild>
            <a href="/subscribe">Subscribe</a>
          </Button>
        </div>
      )
    }
  } else {
    if (!subscription) {
      return (
        <div className="flex flex-col items-center justify-center h-screen p-10 m-auto max-w-5xl gap-2">
          <h1 className="text-3xl font-bold">Subscription Required</h1>
          <p>{`Your organization does not have an active subscription. Please contact your organization's administrator.`}</p>
          <SignOutButton>
            Sign Out
          </SignOutButton>
          <Button variant="link" className="absolute bottom-0 right-0" asChild>
            <Link href="/contact">Need help?</Link>
          </Button>
        </div>
      )
    }
  }
  return (
    <div className="flex overflow-hidden min-h-screen">
      <Sidebar />
      <div className="w-full">
        <InfoBar />
        {children}
      </div>
    </div>
  );
}

export default Layout;