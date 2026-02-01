import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '@/lib/axios'

export interface Job {
  _id: string
  postName: string
  Description: string
  salary: string
  keySkills: string[]
  postedBy: string | { _id: string; fullName: string }
  createdAt: string
  updatedAt: string
}

interface JobState {
  jobs: Job[]
  loading: boolean
  error: string | null
}

const initialState: JobState = {
  jobs: [],
  loading: false,
  error: null,
}

// Async Thunks
export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/jobs')
    return data
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs')
  }
})

export const createJob = createAsyncThunk('jobs/createJob', async (jobData: Partial<Job>, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/jobs', jobData)
    return data
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    return rejectWithValue(error.response?.data?.message || 'Failed to create job')
  }
})

export const updateJob = createAsyncThunk('jobs/updateJob', async ({ id, jobData }: { id: string; jobData: Partial<Job> }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/jobs/${id}`, jobData)
    return data
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    return rejectWithValue(error.response?.data?.message || 'Failed to update job')
  }
})

export const deleteJob = createAsyncThunk('jobs/deleteJob', async (id: string, { rejectWithValue }) => {
  try {
    const { data } = await api.delete(`/jobs/${id}`)
    return { id, message: data.message }
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    return rejectWithValue(error.response?.data?.message || 'Failed to delete job')
  }
})

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearJobError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<unknown>) => {
        state.loading = false
        const payload = action.payload as Job[] | { jobs: Job[] }
        state.jobs = Array.isArray(payload) ? payload : (payload?.jobs || [])
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create Job
      .addCase(createJob.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createJob.fulfilled, (state, action: PayloadAction<{ message: string; job: Job }>) => {
        state.loading = false
        state.jobs.unshift(action.payload.job) // Add new job from the payload.job
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Update Job
      .addCase(updateJob.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateJob.fulfilled, (state, action: PayloadAction<{ message: string; job: Job }>) => {
        state.loading = false
        const index = state.jobs.findIndex(j => j._id === action.payload.job._id)
        if (index !== -1) {
          state.jobs[index] = action.payload.job
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Delete Job
      .addCase(deleteJob.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteJob.fulfilled, (state, action: PayloadAction<{ id: string; message: string }>) => {
        state.loading = false
        state.jobs = state.jobs.filter(j => j._id !== action.payload.id)
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearJobError } = jobSlice.actions
export default jobSlice.reducer
