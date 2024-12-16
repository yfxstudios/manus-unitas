"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const PasswordForm = ({ onSubmit, users }) => {
  const [loading, setLoading] = useState(false);

  const params = useSearchParams();
  const id = params.get("id");
  const email = params.get("email");

  // console.log(users, id, email);

  // console.log(
  //   users.find((user) => user.id === id && user.email === email).id === id
  // );
  // console.log(
  //   users.find((user) => user.id === id && user.email === email).email === email
  // );

  if (!users.find((user) => user.id === id && user.email === email)) {
    return (
      <div className="flex flex-col items-center p-16 min-w-screen min-h-screen gap-4">
        <h1 className="text-3xl font-bold">Invalid Link</h1>
        <p className="text-lg">The link you followed is invalid.</p>
        <Button variant="link" className="absolute bottom-0 right-0" asChild>
          <Link href="/contact">Need help?</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-16 min-w-screen min-h-screen gap-4">
      <h1 className="text-3xl font-bold">Welcome to Manus Unitas</h1>
      <p className="text-lg">
        Your account has been created. Please set your password below.
      </p>
      <form
        className="max-w-[600px] w-full flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault();

          const formData = new FormData(e.target);

          const password = formData.get("password");

          setLoading(true);
          await onSubmit(id, password).then((res) => {
            if (res) {
              alert(res);
            } else {
              signOut({
                callbackUrl: "/signin",
              });
            }
          });
        }}
      >
        <Input type="password" name="password" placeholder="Password" />
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Set Password"}
        </Button>
      </form>
      <p>
        Already set your password?{" "}
        <Link variant="link" href="/signin" className="underline">
          Login
        </Link>
      </p>

      <Button variant="link" className="absolute bottom-0 right-0" asChild>
        <Link href="/contact">Need help?</Link>
      </Button>
    </div>
  );
};
export default PasswordForm;
