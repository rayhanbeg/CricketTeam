import User from "../models/User.js"

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide name, email and password" })
  }

  try {
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }

    user = await User.create({ name, email, password })
    sendTokenResponse(user, 201, res)
  } catch (err) {
    console.error("Register Error:", err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" })
  }

  try {
    const user = await User.findOne({ email }).select("+password")
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    sendTokenResponse(user, 200, res)
  } catch (err) {
    console.error("Login Error:", err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.status(200).json({ success: true, data: user })
  } catch (err) {
    console.error("GetMe Error:", err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
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
  const token = user.getSignedJwtToken()

  const days = Number.parseInt(process.env.JWT_EXPIRE || "7")
  const options = {
    expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  }

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
