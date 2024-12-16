import { updateUser } from "@/lib/mongo/users";

export async function POST(req) {

  const pathname = req.url.split("/").pop().split("?").pop()

  const query = new URLSearchParams(pathname)

  const user = query.get("user")
  
  await updateUser(user, {
    $set: {
      completedTutorial: true
    }
  })

  return new Response({
    status: 200,
    body: "User successfully updated"
  })
}