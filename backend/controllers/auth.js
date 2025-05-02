import User from "../models/User.js"

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  const { name, email, password } = req.body

  // Check if all fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide name, email and password" })
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    user = await User.create({ name, email, password })

    // Send token response
    sendTokenResponse(user, 201, res)
  } catch (err) {
    // Log the error and send response
    console.error("Register Error:", err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" })
  }

  try {
    // Find user by email and include password
    const user = await User.findOne({ email }).select("+password")

    // Check if user exists and password matches
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Send token response
    sendTokenResponse(user, 200, res)
  } catch (err) {
    // Log the error and send response
    console.error("Login Error:", err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    // Find user by id from req.user
    const user = await User.findById(req.user.id).select("-password")
    res.status(200).json({ success: true, data: user })
  } catch (err) {
    // Log the error and send response
    console.error("GetMe Error:", err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  // Set cookie to expire in 10 seconds
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  })

  res.status(200).json({ success: true, data: {} })
}

// Helper: Create token, set cookie, and respond
const sendTokenResponse = (user, statusCode, res) => {
  // Get signed JWT token
  const token = user.getSignedJwtToken()

  // Set cookie options
  const days = Number.parseInt(process.env.JWT_EXPIRE || "7")
  const options = {
    expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000), // Convert days to milliseconds
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  }

  // Send response with token and user data
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
}
