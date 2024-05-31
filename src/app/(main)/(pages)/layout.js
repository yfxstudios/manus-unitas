import React from 'react'


const Layout = ({ children }) => {
  return (
    <div className="border-l-[1px] border-t-[1px] pb-20 rounded-tl-3xl h-full border-muted-foreground/20 overflow-auto ">
      {children}
    </div>
  )
}

export default Layout