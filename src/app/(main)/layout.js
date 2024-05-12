// src/app/(main)/layout.js

import React from "react";

import Sidebar from './sidebar/sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex overflow-hidden h-screen">
      <Sidebar />
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}

export default Layout;