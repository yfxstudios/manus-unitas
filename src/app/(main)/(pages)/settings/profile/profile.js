"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditUserForm from "./_components/editUserForm";
import UpdatePasswordForm from "./_components/updatePasswordForm";
import { useState } from "react";
import { revalidatePath } from "next/cache";

const Profile = ({ user, handleSubmit, handleUpdate }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col p-4 xs:p-16 gap-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="max-w-96">
        <EditUserForm
          user={user}
          handleSubmit={async (data) => {
            await handleUpdate(data).then((res) => {
              if (res) {
                alert(res);
              }
            });
          }}
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="flex w-full h-fit items-center" asChild>
            <Button variant="link" className="text-wrap">
              Change your password
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update password</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <UpdatePasswordForm
              handleSubmit={async (data) => {
                // await handleSubmit(data).then(res => {
                // if (res) {
                // alert(res);
                // } else {
                setOpen(false);
                revalidatePath("/settings/profile");
                // }
                // });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
export default Profile;
