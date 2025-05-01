import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import matchService from "./matchService"

const initialState = {
  matches: [],
  match: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
}

// Get all matches
export const getMatches = createAsyncThunk("matches/getAll", async (_, thunkAPI) => {
  try {
    return await matchService.getMatches()
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Get match by ID
export const getMatchById = createAsyncThunk("matches/getById", async (id, thunkAPI) => {
  try {
    return await matchService.getMatchById(id)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Create new match
export const createMatch = createAsyncThunk("matches/create", async (matchData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await matchService.createMatch(matchData, token)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Update match
export const updateMatch = createAsyncThunk("matches/update", async ({ id, matchData }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await matchService.updateMatch(id, matchData, token)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Delete match
export const deleteMatch = createAsyncThunk("matches/delete", async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    await matchService.deleteMatch(id, token)
    return id
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const matchSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ""
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMatches.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getMatches.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.matches = action.payload
      })
      .addCase(getMatches.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getMatchById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getMatchById.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.match = action.payload
      })
      .addCase(getMatchById.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createMatch.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createMatch.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.matches.push(action.payload)
      })
      .addCase(createMatch.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateMatch.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateMatch.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.matches = state.matches.map((match) => (match._id === action.payload._id ? action.payload : match))
      })
      .addCase(updateMatch.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteMatch.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteMatch.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.matches = state.matches.filter((match) => match._id !== action.payload)
      })
      .addCase(deleteMatch.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = matchSlice.actions
export default matchSlice.reducer
