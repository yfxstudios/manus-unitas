import { deleteUser } from "@/lib/mongo/users"

// get id from url /api/users/:id

export async function DELETE(req) {
  // console.log("URL", req.url)
  const email = req.url.split("/").pop()
  // console.log("EMAIL", email)
  await deleteUser(email).catch((e) => {
    throw new Error(e)
  })
  return new Response({ status: 200 })
}