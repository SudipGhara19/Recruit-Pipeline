import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  _id: string
  fullName: string
  email: string
  role: string
  token: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.token = action.payload.token
      state.isAuthenticated = true
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload))
        console.log('Saved to localStorage:', action.payload.token)
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },
    initializeAuth: (state) => {
       if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        console.log('Initializing Auth. Token:', token, 'User:', user)
        if (token && user) {
          state.token = token
          state.user = JSON.parse(user)
          state.isAuthenticated = true
        }
       }
    }
  },
})

export const { setCredentials, logout, initializeAuth } = authSlice.actions
export default authSlice.reducer
