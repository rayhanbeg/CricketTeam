import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload"
import connectDB from "./config/db.js"
import errorHandler from "./middleware/error.js"

// Load env vars
dotenv.config()

// Debug log for JWT_SECRET
console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET)

// Connect to database
connectDB()

// Route files
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import playerRoutes from "./routes/players.js"
import matchRoutes from "./routes/matches.js"
import uploadRoutes from "./routes/upload.js"
import statisticsRoutes from "./routes/statistics.js"

const app = express()

// Body parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// Enable CORS
app.use(cors())

// File upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
)

// Mount routers
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/players", playerRoutes)
app.use("/api/matches", matchRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/statistics", statisticsRoutes)

// Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`)
  // Close server & exit process
  server.close(() => process.exit(1))
})

export default app
