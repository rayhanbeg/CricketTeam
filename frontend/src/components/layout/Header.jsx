"use client"
import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout, reset } from "../../features/auth/authSlice"
import { FaSignInAlt, FaSignOutAlt, FaUser, FaBars, FaTimes } from "react-icons/fa"
import { MdOutlineSportsCricket } from "react-icons/md"

import { ThemeToggle } from "../theme/theme-toggle"

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate("/")
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleAuthClick = () => {
    if (!user) {
      navigate("/login")
    }
  }

  return (
    <header className="bg-card text-card-foreground shadow-md">
      <div className="container mx-auto py-4 px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <MdOutlineSportsCricket className="text-primary text-2xl" />
            <span className="text-xl font-bold">KNGC Cricket</span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center text-gray-700 dark:text-gray-300 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/players" className="hover:text-primary transition-colors">
              Players
            </Link>
            <Link to="/matches" className="hover:text-primary transition-colors" onClick={handleAuthClick}>
              Matches
            </Link>
            <Link to="/stats" className="hover:text-primary transition-colors" onClick={handleAuthClick}>
              Stats
            </Link>
            {user && user.role === "admin" && (
              <Link to="/admin" className="hover:text-primary transition-colors">
                Admin
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">Welcome, {user.name}</span>
                <button onClick={onLogout} className="btn btn-outline flex items-center space-x-1">
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn btn-outline flex items-center space-x-1">
                  <FaSignInAlt />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="btn btn-primary flex items-center space-x-1">
                  <FaUser />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-4 mb-4">
              <Link to="/" className="hover:text-primary transition-colors py-2" onClick={closeMenu}>
                Home
              </Link>
              <Link to="/players" className="hover:text-primary transition-colors py-2" onClick={closeMenu}>
                Players
              </Link>
              <Link
                to="/matches"
                className="hover:text-primary transition-colors py-2"
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault()
                    closeMenu()
                    navigate("/login")
                  } else {
                    closeMenu()
                  }
                }}
              >
                Matches
              </Link>
              <Link
                to="/stats"
                className="hover:text-primary transition-colors py-2"
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault()
                    closeMenu()
                    navigate("/login")
                  } else {
                    closeMenu()
                  }
                }}
              >
                Stats
              </Link>
              {user && user.role === "admin" && (
                <Link to="/admin" className="hover:text-primary transition-colors py-2" onClick={closeMenu}>
                  Admin
                </Link>
              )}
            </nav>

            <div className="flex flex-col space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <ThemeToggle />

              {user ? (
                <div className="flex flex-col space-y-4">
                  <span className="text-sm">Welcome, {user.name}</span>
                  <button
                    onClick={onLogout}
                    className="btn btn-outline flex items-center justify-center space-x-1 w-full"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="btn btn-outline flex items-center justify-center space-x-1 w-full"
                    onClick={closeMenu}
                  >
                    <FaSignInAlt />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary flex items-center justify-center space-x-1 w-full"
                    onClick={closeMenu}
                  >
                    <FaUser />
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
