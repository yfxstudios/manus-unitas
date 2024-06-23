export { default } from "next-auth/middleware"

// const paths = [
//   {
//     path: "/dashboard",
//     name: "Dashboard",
//     admin: false
//   },
//   {
//     path: "/people",
//     name: "People",
//     admin: true
//   },
//   {
//     path: "/settings",
//     name: "Settings",
//     admin: false
//   },
//   {
//     path: "/analytics",
//     name: "Analytics",
//     admin: true
//   },
//   {
//     path: "/settings/profile",
//     name: "Profile",
//     admin: false
//   },
//   {
//     path: "/settings/organization",
//     name: "Organization",
//     admin: true
//   },
//   {
//     path: "/settings/security",
//     name: "Security",
//     admin: false
//   },
//   {
//     path: "/settings/notifications",
//     name: "Notifications",
//     admin: false
//   },
//   {
//     path: "/settings/billing",
//     name: "Billing",
//     admin: true
//   }
// ]

export const config = {
  matcher: [
    // paths.map(({ path }) => ({ path })),
    "/dashboard",
    "/people",
    "/settings",
    "/analytics",
    "/settings/profile",
    "/settings/organization",
    "/settings/security",
    "/settings/notifications",
    "/settings/billing",
  ],
  redirect: "/signin",
}
