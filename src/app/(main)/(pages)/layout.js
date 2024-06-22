'use client'

import { useEffect } from "react"
import incrementTime from "../incrementTime"
import { getCurrentUser } from "@/app/actions"

const Layout = ({ children }) => {
  useEffect(() => { // usage tracker
    const interval = setInterval(async () => {
      const user = await getCurrentUser()
      incrementTime(user.email, 10)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="border-l-[1px] border-t-[1px] pb-20 rounded-tl-3xl h-full border-muted-foreground/20 overflow-auto ">
      {children}
    </div>
  )
}

export default Layout