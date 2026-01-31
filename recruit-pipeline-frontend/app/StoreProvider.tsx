'use client'
import { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '@/lib/store'
import { initializeAuth } from '@/lib/features/auth/authSlice'

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [store] = useState(() => makeStore())

  useEffect(() => {
    store.dispatch(initializeAuth())
  }, [store])

  return <Provider store={store}>{children}</Provider>
}
