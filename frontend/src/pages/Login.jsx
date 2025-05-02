"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { login, reset } from "../features/auth/authSlice"
import Spinner from "../components/layout/Spinner"
import { motion } from "framer-motion"
import { FaEnvelope, FaLock } from "react-icons/fa6"
import { PiSignIn } from "react-icons/pi"
import { BiCricketBall } from "react-icons/bi"

const Login = () => {
  // State for form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // State for showing/hiding password
  const [showPassword, setShowPassword] = useState(false)

  // Destructure form data
  const { email, password } = formData

  // Hooks for navigation and Redux
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  // Get auth state from Redux
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

  // Get the return URL if available
  const from = location.state?.from || "/"

  // Handle side effects
  useEffect(() => {
    // Show error message if login fails
    if (isError) {
      toast.error(message)
    }

    // Redirect if login succeeds or user is already logged in
    if (isSuccess || user) {
      navigate(from)
    }

    // Reset auth state
    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch, from])

  // Handle form input changes
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault()

    // Create user data object
    const userData = {
      email,
      password,
    }

    // Dispatch login action
    dispatch(login(userData))
  }

  // Show spinner while loading
  if (isLoading) {
    return <Spinner />
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#020817] pt-16">
      <motion.div
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <div className="flex justify-center">
            <motion.div
              className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
            >
              <BiCricketBall className="text-4xl text-green-600 dark:text-green-400" />
            </motion.div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          {location.state?.from && (
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              You need to sign in to access that page
            </p>
          )}
        </motion.div>

        <motion.form className="mt-8 space-y-6" onSubmit={onSubmit} variants={itemVariants}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={onChange}
                className="appearance-none rounded-t-md relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={onChange}
                className="appearance-none rounded-b-md relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <motion.button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <PiSignIn className="h-5 w-5 text-green-500 group-hover:text-green-400" />
              </span>
              Sign in
            </motion.button>
          </div>
        </motion.form>

        <motion.div variants={itemVariants} className="text-center">
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Not a member?{" "}
            <motion.span whileHover={{ scale: 1.05 }} className="inline-block">
              <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                Register now
              </Link>
            </motion.span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login
