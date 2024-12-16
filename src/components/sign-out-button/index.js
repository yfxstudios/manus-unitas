'use client'

import { signOut } from "next-auth/react"
import { Button } from "../ui/button"

const SignOutButton = ({ children }, ...props) => {
  return (
    <Button onClick={() => signOut()} {...props} className="w-full">
      {children}
    </Button>
  )
}
export default SignOutButton