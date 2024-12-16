import { House, Users, Gear, ChartLineUp } from "@phosphor-icons/react"

export const menuOptions = [
  { name: 'Dashboard', Component: House, href: '/dashboard', admin: false },
  { name: 'People', Component: Users, href: '/people', admin: true },
  { name: 'Analytics', Component: ChartLineUp, href: '/analytics', admin: true },
  { name: 'Settings', Component: Gear, href: '/settings', admin: false },
]
