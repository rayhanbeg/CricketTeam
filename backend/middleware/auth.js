import jwt from "jsonwebtoken"
import User from "../models/User.js"

// Protect routes
export const protect = async (req, res, next) => {
  let token

  // Check for Bearer token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]

      // Use the same fallback secret as in the User model
      const secret = process.env.JWT_SECRET || "fallback_secret_key_for_development_only"

      if (!secret || secret.trim() === "") {
        return res.status(500).json({ message: "JWT_SECRET is not defined or is empty" })
      }

      // Verify token
      const decoded = jwt.verify(token, secret)

      // Attach user to request
      req.user = await User.findById(decoded.id).select("-password")

      if (!req.user) {
        return res.status(401).json({ message: "User not found" })
      }

      next()
    } catch (error) {
      console.error("Token verification failed:", error.message)
      return res.status(401).json({ message: "Not authorized, token failed" })
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" })
  }
}

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role "${req.user?.role}" is not authorized to access this route`,
      })
    }
    next()
  }
}
