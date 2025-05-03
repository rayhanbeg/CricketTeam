"use client"

import { useState, useEffect } from "react"
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout, reset } from "../../features/auth/authSlice"
import { MdOutlineSportsCricket } from "react-icons/md"
import { FaSignInAlt, FaSignOutAlt, FaUser, FaBars, FaTimes } from "react-icons/fa"

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate("/")
    setIsMenuOpen(false)
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const handleAuthClick = () => {
    if (!user) {
      navigate("/login")
    }
  }

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Players", path: "/players" },
    { name: "Matches", path: "/matches", requiresAuth: true },
    { name: "Stats", path: "/stats", requiresAuth: true },
  ]

  if (user && user.role === "admin") {
    navItems.push({ name: "Admin", path: "/admin" })
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg transparent backdrop-blur-md" : "bg-[#15151F]"}`}>
      <div className="container mx-auto py-4 px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group" onClick={closeMenu}>
            <MdOutlineSportsCricket className="text-emerald-500 text-2xl" />
            <span className="text-xl font-medium text-white">KNGC Cricket</span>
          </Link>

          <button className="md:hidden flex items-center text-gray-300 focus:outline-none" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={item.requiresAuth ? handleAuthClick : undefined}
                className={({ isActive }) =>
                  `relative pb-1 text-sm ${
                    isActive ? "border-b-2 border-emerald-500 text-white" : "border-b-2 border-transparent text-gray-300"
                  } hover:text-white transition-all`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-xs bg-zinc-800 px-3 py-1 rounded-full">{user.name}</span>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1 text-xs px-3 py-1.5 border border-zinc-700 rounded-md hover:bg-zinc-800 transition-colors"
                >
                  <FaSignOutAlt className="text-xs" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-xs px-3 py-1.5 border border-zinc-700 rounded-md hover:bg-zinc-800 transition-colors flex items-center space-x-1"
                >
                  <FaSignInAlt className="text-xs" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="text-xs px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors flex items-center space-x-1"
                >
                  <FaUser className="text-xs" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-zinc-800">
            <nav className="flex flex-col space-y-4 mb-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="hover:text-emerald-500 transition-colors py-2 block text-sm"
                  onClick={(e) => {
                    if (item.requiresAuth && !user) {
                      e.preventDefault()
                      closeMenu()
                      navigate("/login")
                    } else {
                      closeMenu()
                    }
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col space-y-4 pt-4 border-t border-zinc-800">
              {user ? (
                <div className="flex flex-col space-y-4">
                  <span className="text-xs bg-zinc-800 px-3 py-1 rounded-full text-center">{user.name}</span>
                  <button
                    onClick={onLogout}
                    className="flex items-center justify-center space-x-1 text-xs px-3 py-1.5 border border-zinc-700 rounded-md hover:bg-zinc-800 transition-colors"
                  >
                    <FaSignOutAlt className="text-xs" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="text-xs px-3 py-1.5 border border-zinc-700 rounded-md hover:bg-zinc-800 transition-colors flex items-center justify-center space-x-1"
                  >
                    <FaSignInAlt className="text-xs" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="text-xs px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors flex items-center justify-center space-x-1"
                  >
                    <FaUser className="text-xs" />
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
