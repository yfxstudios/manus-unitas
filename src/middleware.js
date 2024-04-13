export { default } from "next-auth/middleware"

// block every page except / 
export const config = {
  matcher: [
    "/dashboard",
  ],
  redirect: "/signin",
}