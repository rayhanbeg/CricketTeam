

import { motion } from "framer-motion"

// Fade in animation
export const FadeIn = ({ children, delay = 0, duration = 0.5, ...props }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration, delay }} {...props}>
    {children}
  </motion.div>
)

// Slide up animation
export const SlideUp = ({ children, delay = 0, duration = 0.5, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay }}
    {...props}
  >
    {children}
  </motion.div>
)

// Slide in from left animation
export const SlideInLeft = ({ children, delay = 0, duration = 0.5, ...props }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration, delay }}
    {...props}
  >
    {children}
  </motion.div>
)

// Slide in from right animation
export const SlideInRight = ({ children, delay = 0, duration = 0.5, ...props }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration, delay }}
    {...props}
  >
    {children}
  </motion.div>
)

// Scale animation
export const ScaleIn = ({ children, delay = 0, duration = 0.5, ...props }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration, delay }}
    {...props}
  >
    {children}
  </motion.div>
)

// Staggered children animation container
export const StaggerContainer = ({ children, staggerChildren = 0.1, delayChildren = 0, ...props }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren,
          delayChildren,
        },
      },
    }}
    initial="hidden"
    animate="show"
    {...props}
  >
    {children}
  </motion.div>
)

// Staggered child item
export const StaggerItem = ({ children, ...props }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 24,
        },
      },
    }}
    {...props}
  >
    {children}
  </motion.div>
)

// Hover animation for cards
export const HoverCard = ({ children, ...props }) => (
  <motion.div
    whileHover={{
      scale: 1.03,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 },
    }}
    whileTap={{ scale: 0.98 }}
    {...props}
  >
    {children}
  </motion.div>
)

// Pulse animation
export const Pulse = ({ children, ...props }) => (
  <motion.div
    animate={{
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration: 2,
      ease: "easeInOut",
      times: [0, 0.5, 1],
      repeat: Number.POSITIVE_INFINITY,
      repeatDelay: 0.5,
    }}
    {...props}
  >
    {children}
  </motion.div>
)

// Page transition wrapper
export const PageTransition = ({ children, ...props }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    {...props}
  >
    {children}
  </motion.div>
)

// Button animation
export const AnimatedButton = ({ children, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    {...props}
  >
    {children}
  </motion.button>
)

// Scroll-triggered animation
export const ScrollReveal = ({ children, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6 }}
    {...props}
  >
    {children}
  </motion.div>
)
