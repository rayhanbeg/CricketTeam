import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import statisticsService from "./statisticsService"

const initialState = {
  teamStats: null,
  playerStats: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
}

// Get team statistics
export const getTeamStatistics = createAsyncThunk("statistics/getTeam", async (_, thunkAPI) => {
  try {
    return await statisticsService.getTeamStatistics()
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Get player statistics
export const getPlayerStatistics = createAsyncThunk("statistics/getPlayer", async (playerId, thunkAPI) => {
  try {
    return await statisticsService.getPlayerStatistics(playerId)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Update player statistics
export const updatePlayerStatistics = createAsyncThunk(
  "statistics/updatePlayer",
  async ({ playerId, statsData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await statisticsService.updatePlayerStatistics(playerId, statsData, token)
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  },
)

// Add manual team statistics
export const addManualTeamStatistics = createAsyncThunk("statistics/addManualTeam", async (matchData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await statisticsService.addManualTeamStatistics(matchData, token)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const statisticsSlice = createSlice({
  name: "statistics",
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
      .addCase(getTeamStatistics.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      .addCase(getTeamStatistics.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        state.teamStats = action.payload
      })
      .addCase(getTeamStatistics.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getPlayerStatistics.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      .addCase(getPlayerStatistics.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        state.playerStats = action.payload
      })
      .addCase(getPlayerStatistics.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updatePlayerStatistics.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      .addCase(updatePlayerStatistics.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
        state.playerStats = {
          ...state.playerStats,
          stats: action.payload.stats,
        }
      })
      .addCase(updatePlayerStatistics.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(addManualTeamStatistics.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      .addCase(addManualTeamStatistics.fulfilled, (state) => {
        state.isLoading = false
        state.isSuccess = true
        state.isError = false
      })
      .addCase(addManualTeamStatistics.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = statisticsSlice.actions
export default statisticsSlice.reducer
