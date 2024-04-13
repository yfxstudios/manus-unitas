'use client'

import { useLayoutEffect } from "react";
import { animatePageIn } from "@/utils/animations";
import { usePathname } from "next/navigation";
import { useState, useEffect } from 'react';

export default function Template({ children }) {
  useLayoutEffect(() => {
    animatePageIn();
  }, []);

  const pathname = usePathname();

  if (pathname === "/dashboard") {
    return (<>{children}</>
    );
  }

  const { width } = useWindowDimensions();

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



function getWindowDimensions() {
  if (typeof window === 'undefined') {
    return {
      width: 0,
      height: 0
    };
  }

  const { innerWidth, innerHeight } = window;

  return {
    width: innerWidth,
    height: innerHeight
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
