'use client'

import { useLayoutEffect } from "react";
import { animatePageIn } from "@/utils/animations";
import { usePathname } from "next/navigation";

export default function Template({ children }) {
  useLayoutEffect(() => {
    animatePageIn();
  }, []);

  const pathname = usePathname();

  if (pathname === "/dashboard") {
    return (<>{children}</>
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


