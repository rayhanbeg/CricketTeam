import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import playerService from "./playerService"

const initialState = {
  players: [],
  player: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
}

// Get all players
export const getPlayers = createAsyncThunk("players/getAll", async (_, thunkAPI) => {
  try {
    return await playerService.getPlayers()
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Get player by ID
export const getPlayerById = createAsyncThunk("players/getById", async (id, thunkAPI) => {
  try {
    return await playerService.getPlayerById(id)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Create new player
export const createPlayer = createAsyncThunk("players/create", async (playerData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await playerService.createPlayer(playerData, token)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Update player
export const updatePlayer = createAsyncThunk("players/update", async ({ id, playerData }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await playerService.updatePlayer(id, playerData, token)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Delete player
export const deletePlayer = createAsyncThunk("players/delete", async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    await playerService.deletePlayer(id, token)
    return id
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Update player stats
export const updatePlayerStats = createAsyncThunk("players/updateStats", async ({ id, statsData }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await playerService.updatePlayerStats(id, statsData, token)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const playerSlice = createSlice({
  name: "player",
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
      .addCase(getPlayers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getPlayers.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.players = action.payload
      })
      .addCase(getPlayers.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getPlayerById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getPlayerById.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.player = action.payload
      })
      .addCase(getPlayerById.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createPlayer.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
        state.isError = false
      })
      .addCase(createPlayer.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.players.push(action.payload)
      })
      .addCase(createPlayer.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updatePlayer.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
        state.isError = false
      })
      .addCase(updatePlayer.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.players = state.players.map((player) => (player._id === action.payload._id ? action.payload : player))
        state.player = action.payload
      })
      .addCase(updatePlayer.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deletePlayer.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deletePlayer.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.players = state.players.filter((player) => player._id !== action.payload)
      })
      .addCase(deletePlayer.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updatePlayerStats.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updatePlayerStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.players = state.players.map((player) => (player._id === action.payload._id ? action.payload : player))
        state.player = action.payload
      })
      .addCase(updatePlayerStats.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = playerSlice.actions
export default playerSlice.reducer
