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

// Enable CORS with specific origins
app.use(
  cors({
    origin: ["http://localhost:5173", "https://thewings-kngc.vercel.app"],
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
)

// File upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
)

// Root endpoint
app.get("/", (req, res) => {
  res.send("Hello World")
})

// Mount routers
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/players", playerRoutes)
app.use("/api/matches", matchRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/statistics", statisticsRoutes)

// Error handler
app.use(errorHandler)

// Listen
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})

export default app
