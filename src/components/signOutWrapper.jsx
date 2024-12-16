"use client";

import { signOut } from "next-auth/react";
import React from "react";

const SignOutWrapper = ({ children }) => {
	return <div onClick={() => signOut()}>{children}</div>;
};

export default SignOutWrapper;
