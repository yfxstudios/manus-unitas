"use client";

import { usePathname, useRouter } from "next/navigation";
import { animatePageOut } from "@/utils/animations";

const TransitionLink = ({ href, children, className }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    if (pathname !== href) {
      animatePageOut(href, router);
    }
  };

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
};

export default TransitionLink;
