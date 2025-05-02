

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { register, reset } from "../features/auth/authSlice"
import Spinner from "../components/layout/Spinner"
import { motion } from "framer-motion"
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa6"
import { BiCricketBall } from "react-icons/bi"

const Register = () => {
  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  })

  // State for showing/hiding password and password strength
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Destructure form data
  const { name, email, password, password2 } = formData

  // Hooks for navigation and Redux
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Get auth state from Redux
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

  // Handle side effects
  useEffect(() => {
    // Show error message if registration fails
    if (isError) {
      toast.error(message)
    }

    // Redirect if registration succeeds or user is already logged in
    if (isSuccess || user) {
      navigate("/")
    }

    // Reset auth state
    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  // Handle form input changes
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))

    // Calculate password strength
    if (e.target.name === "password") {
      const value = e.target.value
      let strength = 0

      // Check password length
      if (value.length >= 8) strength += 1
      // Check for uppercase letters
      if (/[A-Z]/.test(value)) strength += 1
      // Check for numbers
      if (/[0-9]/.test(value)) strength += 1
      // Check for special characters
      if (/[^A-Za-z0-9]/.test(value)) strength += 1

      setPasswordStrength(strength)
    }
  }

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault()

    // Check if passwords match
    if (password !== password2) {
      toast.error("Passwords do not match")
    } else {
      // Create user data object
      const userData = {
        name,
        email,
        password,
      }

      // Dispatch register action
      dispatch(register(userData))
    }
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

  // Password strength indicator
  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200 dark:bg-gray-700"
    if (passwordStrength === 1) return "bg-red-500"
    if (passwordStrength === 2) return "bg-yellow-500"
    if (passwordStrength === 3) return "bg-blue-500"
    return "bg-green-500"
  }

  const getStrengthText = () => {
    if (passwordStrength === 0) return ""
    if (passwordStrength === 1) return "Weak"
    if (passwordStrength === 2) return "Fair"
    if (passwordStrength === 3) return "Good"
    return "Strong"
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">Join our cricket community today</p>
        </motion.div>

        <motion.form className="mt-8 space-y-6" onSubmit={onSubmit} variants={itemVariants}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={onChange}
                className="appearance-none rounded-t-md relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
              />
            </div>
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
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
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
                autoComplete="new-password"
                required
                value={password}
                onChange={onChange}
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
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
            {password && (
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                    <motion.div
                      className={`h-full ${getStrengthColor()}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${passwordStrength * 25}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{getStrengthText()}</span>
                </div>
              </div>
            )}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password2"
                name="password2"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password2}
                onChange={onChange}
                className="appearance-none rounded-b-md relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
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
                <FaUserPlus className="h-5 w-5 text-green-500 group-hover:text-green-400" />
              </span>
              Register
            </motion.button>
          </div>
        </motion.form>

        <motion.div variants={itemVariants} className="text-center">
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <motion.span whileHover={{ scale: 1.05 }} className="inline-block">
              <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                Sign in
              </Link>
            </motion.span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Register
