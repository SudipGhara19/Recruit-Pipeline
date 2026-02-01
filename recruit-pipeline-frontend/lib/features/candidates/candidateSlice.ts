import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '@/lib/axios'

export interface Candidate {
  _id: string
  fullName: string
  email: string
  phone?: string
  skills?: string[]
  yearsOfExperience?: string
  jobRole?: {
    _id: string
    postName: string
  }
  stage: 'Applied' | 'Screening' | 'Interview' | 'Technical' | 'HR' | 'Selected' | 'Rejected'
  resume?: string // URL
  addedBy?: {
    _id: string
    fullName: string
  }
  createdAt: string
  updatedAt: string
}

interface CandidateState {
  candidates: Candidate[]
  loading: boolean
  error: string | null
  success: boolean
}

const initialState: CandidateState = {
  candidates: [],
  loading: false,
  error: null,
  success: false,
}

export const addCandidate = createAsyncThunk(
  'candidates/addCandidate',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/candidates', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return data
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(error.response?.data?.message || 'Failed to add candidate')
    }
  }
)

export const fetchCandidates = createAsyncThunk(
  'candidates/fetchCandidates',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/candidates')
      return data
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch candidates')
    }
  }
)

export const updateCandidateStage = createAsyncThunk(
  'candidates/updateCandidateStage',
  async ({ id, stage }: { id: string; stage: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/candidates/${id}`, { stage })
      return data.candidate
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(error.response?.data?.message || 'Failed to update stage')
    }
  }
)

export const deleteCandidate = createAsyncThunk(
  'candidates/deleteCandidate',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/candidates/${id}`)
      return id
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(error.response?.data?.message || 'Failed to delete candidate')
    }
  }
)

const candidateSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    clearCandidateState: (state) => {
      state.error = null
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Candidate
      .addCase(addCandidate.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(addCandidate.fulfilled, (state, action) => {
        state.loading = false
        state.candidates.unshift(action.payload.candidate)
        state.success = true
      })
      .addCase(addCandidate.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.success = false
      })
      // Update Stage
      .addCase(updateCandidateStage.fulfilled, (state, action: PayloadAction<Candidate>) => {
        const index = state.candidates.findIndex((c) => c._id === action.payload._id)
        if (index !== -1) {
          state.candidates[index] = action.payload
        }
      })
      // Delete Candidate
      .addCase(deleteCandidate.fulfilled, (state, action: PayloadAction<string>) => {
        state.candidates = state.candidates.filter(c => c._id !== action.payload)
      })
      // Fetch Candidates
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCandidates.fulfilled, (state, action: PayloadAction<Candidate[]>) => {
        state.loading = false
        state.candidates = action.payload
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCandidateState } = candidateSlice.actions
export default candidateSlice.reducer
