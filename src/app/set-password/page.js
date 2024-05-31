import PasswordForm from "./passwordForm"
import Users from "@/lib/schemas/userSchema"

const SetPassword = async () => {
  const users = await Users.find().lean()

  return (
    <div>
      <PasswordForm
        users={users.map(user => {
          return {
            id: user._id,
            email: user.email,
          }
        })}

        onSubmit={async (id, password) => {
          'use server'

          const user = await Users.findOne({ _id: id })

          if (!user) {
            return "User not found"
          } else if (user.completedSignup || user.password !== null) {
            return "Password already set"
          }

          user.password = password
          user.completedSignup = true

          await user.save()
        }} />
    </div>
  )
}
export default SetPassword