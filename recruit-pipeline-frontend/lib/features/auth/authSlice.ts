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
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    }
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
