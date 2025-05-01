import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import playerReducer from "../features/players/playerSlice"
import matchReducer from "../features/matches/matchSlice"
import userReducer from "../features/users/userSlice"
import uploadReducer from "../features/upload/uploadSlice"
import statisticsReducer from "../features/statistics/statisticsSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    players: playerReducer,
    matches: matchReducer,
    users: userReducer,
    upload: uploadReducer,
    statistics: statisticsReducer,
  },
})
