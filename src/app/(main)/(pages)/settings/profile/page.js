import { getServerSession } from "next-auth";
import Profile from "./profile";
import Users from "@/lib/schemas/userSchema";
import { revalidatePath } from "next/cache";

const page = async () => {
  const session = await getServerSession();
  const user = await Users.findOne({ email: session.user.email });

  const handleSubmit = async data => {
    "use server";

    const currentUser = await Users.findOne({ email: session.user.email });

    if (data.current_password !== user.password) {
      return "Current password is incorrect";
    }

    currentUser.password = data.new_password;
    await currentUser.save();

    revalidatePath("/settings/profile");
  };

  const handleUpdate = async data => {
    "use server";
    console.log(data);

    const user = await Users.updateOne({ email: session.user.email }, data).lean().then(res => {
      return res;
    })
  };

  return (
    <div>
      <Profile
        user={user}
        handleSubmit={async data => {
          "use server";
          return handleSubmit(data);
        }}
        handleUpdate={async data => {
          "use server";
          return handleUpdate(data);
        }}
      />
    </div>
  );
};
export default page;
