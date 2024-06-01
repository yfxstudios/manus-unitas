'use client'

import { signOut } from "next-auth/react"
import { Button } from "../ui/button"

const SignOutButton = ({ children }, ...props) => {
  return (
    <Button onClick={() => signOut()} {...props}>
      {children}
    </Button>
  )
}
export default SignOutButton