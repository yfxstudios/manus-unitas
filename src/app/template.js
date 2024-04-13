'use client'

import { useLayoutEffect } from "react";
import { animatePageIn } from "@/utils/animations";
import { usePathname } from "next/navigation";

export default function Template({ children }) {


  useLayoutEffect(() => {
    animatePageIn(pathname);
  }, []);

  const pathname = usePathname();

  if (pathname === "/dashboard") {
    return (<>{children}</>
    );
  }

  if (pathname === "/") {
    return (
      <div>
        <div className="min-h-screen w-screen bg-neutral-950 fixed top-0 left-0 z-[1000]" id="loading-screen">
          <span className="loading loading-ring loading-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        {children}
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen w-1/4 bg-neutral-950 fixed top-0 left-0 z-[1000]" id="banner-1" />
      <div className="min-h-screen w-1/4 bg-neutral-950 fixed top-0 left-1/4 z-[1000]" id="banner-2" />
      <div className="min-h-screen w-1/4 bg-neutral-950 fixed top-0 left-2/4 z-[1000]" id="banner-3" />
      <div className="min-h-screen w-1/4 bg-neutral-950 fixed top-0 left-3/4 z-[1000]" id="banner-4" />
      {children}
    </div>
  );

}


