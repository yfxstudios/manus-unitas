import { Suspense } from "react";
import PasswordForm from "./passwordForm";
import Users from "@/lib/schemas/userSchema";

export const dynamic = "force-dynamic";

const SetPassword = async () => {
  const users = await Users.find().lean();

  return (
    <Suspense>
      <PasswordForm
        users={users.map((user) => {
          return {
            id: user._id,
            email: user.email,
          };
        })}
        onSubmit={async (id, password) => {
          "use server";

          const user = await Users.findOne({ _id: id });

          if (!user) {
            return "User not found";
          } else if (user.completedSignup || user.password !== null) {
            return "Password already set";
          }

          user.password = password;
          user.completedSignup = true;

          await user.save();
        }}
      />
    </Suspense>
  );
};
export default SetPassword;
