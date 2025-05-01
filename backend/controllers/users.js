import User from "../models/User.js"

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.status(200).json({ success: true, count: users.length, data: users })
  } catch (err) {
    console.error("GetUsers Error:", err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({ success: true, data: user })
  } catch (err) {
    console.error("GetUser Error:", err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      context: "query",
    }).select("-password")

    res.status(200).json({ success: true, data: updatedUser })
  } catch (err) {
    console.error("UpdateUser Error:", err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({ success: true, data: {} })
  } catch (err) {
    console.error("DeleteUser Error:", err.message)
    res.status(500).json({ message: "Server error" })
  }
}
