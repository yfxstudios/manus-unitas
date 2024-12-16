"use client";

import { usePathname, useRouter } from "next/navigation";
import { animatePageOut, animatePageIn } from "@/utils/animations";
import { useLayoutEffect } from "react";

const TransitionLink = ({ href, children, className }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    animatePageOut(href, router)
  };



  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
};

export default TransitionLink;
