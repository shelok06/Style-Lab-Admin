'use client'
import React from 'react'
import { SessionProvider } from "next-auth/react"

const SessionWrapper = ({children}) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

export default SessionWrapper
