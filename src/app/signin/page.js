"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import verifySignIn from "../verifySignIn";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { getUser } from "./getUser";

export default function SignIn() {
  const router = useRouter();

  const buttonRef = useRef(null);
  const modalRef = useRef(null);

  // get search params from URL

  let params = null;

  if (typeof window !== "undefined") {
    params = new URLSearchParams(window.location.search);
  }

  const [signedIn, setSignedIn] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  // 2FA
  const [userToken, setUserToken] = useState("");

  useEffect(() => {
    if (params && params.get("error")) {
      if (
        params.get("error") === "User not found" ||
        params.get("error") === "Password incorrect"
      ) {
        setError("Invalid email or password");
      } else {
        setError(params.get("error") + ". Contact support for help");
      }
    }
  }, []);

  const isSignedIn = async () => {
    setSignedIn(await verifySignIn());
  };

  useEffect(() => {
    isSignedIn();
  }, []);

  if (signedIn) {
    router.push("/dashboard");
    return (
      <div>
        <h1>Redirecting...</h1>
      </div>
    );
  } else if (signedIn === false) {
    return (
      <div className="flex flex-col space-y-8 items-center justify-center min-h-screen py-2">
        <h1 className="text-3xl font-bold text-center">Sign In</h1>
        <form
          className="flex flex-col space-y-4 w-72 lg:w-96 xs:w-80 2xs:w-full"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const user = await getUser(email);

            if (user.twoFactorAuth.verified === true) {
              setOpen(true);
              setLoading(false);
              return;
            }

            const result = await signIn("credentials", {
              redirect: true,
              email,
              password,
              callbackUrl: "/dashboard",
            });
          }}
        >
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="Email" />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Password</Label>
            <Input type="password" id="password" placeholder="Password" />
          </div>

          {!loading && (
            <Button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              ref={buttonRef}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          )}

          <Button
            onClick={() => {
              setLoading(true);
              signIn("credentials", {
                redirect: true,
                email: "matt.yakligian@gmail.com",
                password: "mattyak",
                callbackUrl: "/subscribe",
              });
            }}
            variant="secondary"
            disabled={loading}
          >
            {loading ? "Signing In..." : "or Continue with Demo"}
          </Button>
        </form>
        {error && (
          <div className="absolute bottom-4 right-4 z-50 rounded-lg p-4">
            <div
              role="alert"
              className="alert alert-error drop-shadow-lg flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Two Step Verification</DialogTitle>
              <DialogDescription>
                Open your authenticator app and enter the 6-digit code generated
                by the app to verify your identity.
              </DialogDescription>
            </DialogHeader>
            <InputOTP
              maxLength={6}
              onChange={(value) => setUserToken(value)}
              value={userToken}
              className="flex justify-center"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <DialogFooter>
              <Button
                onClick={async () => {
                  const result = await signIn("credentials", {
                    email: document.getElementById("email").value,
                    password: document.getElementById("password").value,
                    twoFactorAuth: userToken,
                    callbackUrl: "/dashboard",
                  });

                  console.log(result);
                }}
                disabled={loading}
              >
                {loading ? "Loading..." : "Sign In"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }
}
