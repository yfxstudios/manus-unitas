'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { useState } from 'react'

import { NextUIProvider } from "@nextui-org/react";


import { store } from './store'
import { Provider } from 'react-redux'

const Providers = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
      >
        <Provider store={store}>
          {children}
        </Provider>
      </ThemeProvider>
    </QueryClientProvider >
  )
}

export default Providers
