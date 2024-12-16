import Users from "@/lib/schemas/userSchema"
import Security from "./security"
import { getServerSession } from "next-auth"

const page = async () => {
  const session = await getServerSession()
  const user = await Users.findOne({ email: session.user.email })
  return (
    <Security user={user} />
  )
}
export default page