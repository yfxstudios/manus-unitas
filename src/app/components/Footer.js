import React from "react";
import Image from "next/image";
import { GithubLogo, TwitterLogo, YoutubeLogo } from "@phosphor-icons/react";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="dark bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* <Link className="text-white hover:text-gray-300" href="#">
            <YoutubeLogo className="h-6 w-6" />
            <span className="sr-only">YouTube</span>
          </Link>
          <Link className="text-white hover:text-gray-300" href="#">
            <GithubLogo className="h-6 w-6" />
            <span className="sr-only">GitHub</span>
          </Link> */}
          <Link className="text-white hover:text-gray-300" href="#">
            <TwitterLogo className="h-6 w-6" />
            <span className="sr-only">Twitter</span>
          </Link>
        </div>
        <p className="mt-4 md:mt-0 text-sm text-gray-300">© 2024 Manus Unitas  All rights reserved.</p>
      </div>
    </div>
  );
}
