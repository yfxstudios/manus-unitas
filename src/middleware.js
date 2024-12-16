
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const paths = [
  {
    path: "/dashboard",
    name: "Dashboard",
    admin: false
  },
  {
    path: "/people",
    name: "People",
    admin: true
  },
  {
    path: "/settings",
    name: "Settings",
    admin: false
  },
  {
    path: "/analytics",
    name: "Analytics",
    admin: true
  },
  {
    path: "/settings/profile",
    name: "Profile",
    admin: false
  },
  {
    path: "/settings/organization",
    name: "Organization",
    admin: true
  },
  {
    path: "/settings/security",
    name: "Security",
    admin: false
  },
  {
    path: "/settings/notifications",
    name: "Notifications",
    admin: false
  },
  {
    path: "/settings/billing",
    name: "Billing",
    admin: true
  }
]

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    if (
      paths.find((p) => p.path === req.path) &&
      paths.find((p) => p.path === req.path).admin &&
      !req.token
    ) {
      return new NextResponse("You are not authorized!");
    }
  },
  {
    callbacks: {
      authorized: (params) => {
        let { token } = params;
        return !!token;
      },
    },
  }
);

export const config = { matcher: ["/dashboard", "/people", "/settings", "/analytics", "/settings/profile", "/settings/organization", "/settings/security", "/settings/notifications", "/settings/billing"] };