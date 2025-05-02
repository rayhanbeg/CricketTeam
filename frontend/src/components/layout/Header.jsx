
import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout, reset } from "../../features/auth/authSlice"
import { FaSignInAlt, FaSignOutAlt, FaUser, FaBars, FaTimes } from "react-icons/fa"
import { MdOutlineSportsCricket } from "react-icons/md"
import { ThemeToggle } from "../theme/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

  // Navigation items
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
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md" : "bg-white dark:bg-[#020817]"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto py-4 px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group" onClick={closeMenu}>
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
              <MdOutlineSportsCricket className="text-primary text-2xl" />
            </motion.div>
            <motion.span
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400 dark:from-green-400 dark:to-green-200"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              KNGC Cricket
            </motion.span>
          </Link>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden flex items-center text-gray-700 dark:text-gray-300 focus:outline-none"
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </motion.button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className="relative group"
                  onClick={item.requiresAuth ? handleAuthClick : undefined}
                >
                  <span className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                    {item.name}
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center space-x-4">
                <motion.span
                  className="text-sm bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  Welcome, {user.name}
                </motion.span>
                <motion.button
                  onClick={onLogout}
                  className="btn btn-outline flex items-center space-x-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/login" className="btn btn-outline flex items-center space-x-1">
                    <FaSignInAlt />
                    <span>Login</span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/register" className="btn btn-primary flex items-center space-x-1">
                    <FaUser />
                    <span>Register</span>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="flex flex-col space-y-4 mb-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className="hover:text-primary transition-colors py-2 block"
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
                  </motion.div>
                ))}
              </nav>

              <div className="flex flex-col space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <ThemeToggle />

                {user ? (
                  <div className="flex flex-col space-y-4">
                    <motion.span
                      className="text-sm bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Welcome, {user.name}
                    </motion.span>
                    <motion.button
                      onClick={onLogout}
                      className="btn btn-outline flex items-center justify-center space-x-1 w-full"
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/login"
                        className="btn btn-outline flex items-center justify-center space-x-1 w-full"
                        onClick={closeMenu}
                      >
                        <FaSignInAlt />
                        <span>Login</span>
                      </Link>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/register"
                        className="btn btn-primary flex items-center justify-center space-x-1 w-full"
                        onClick={closeMenu}
                      >
                        <FaUser />
                        <span>Register</span>
                      </Link>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default Header
