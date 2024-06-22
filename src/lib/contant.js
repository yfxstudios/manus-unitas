import { House, Users, Gear, ChartLineUp } from "@phosphor-icons/react"

export const menuOptions = [
  { name: 'Dashboard', Component: House, href: '/dashboard' },
  { name: 'People', Component: Users, href: '/people' },
  { name: 'Analytics', Component: ChartLineUp, href: '/analytics' },
  { name: 'Settings', Component: Gear, href: '/settings' },
]
