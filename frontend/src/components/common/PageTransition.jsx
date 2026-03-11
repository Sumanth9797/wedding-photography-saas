import { motion } from 'framer-motion'

// Variants for different transition styles
const swipeVariants = {
  initial: { opacity: 0, x: 28, filter: 'blur(4px)' },
  in:      { opacity: 1, x: 0,  filter: 'blur(0px)' },
  out:     { opacity: 0, x: -28, filter: 'blur(4px)' },
}

const fadeUpVariants = {
  initial: { opacity: 0, y: 20 },
  in:      { opacity: 1, y: 0  },
  out:     { opacity: 0, y: -12 },
}

const scaleVariants = {
  initial: { opacity: 0, scale: 0.97 },
  in:      { opacity: 1, scale: 1    },
  out:     { opacity: 0, scale: 1.02 },
}

// Spring-based easing for premium feel
const springTransition = {
  type: 'spring',
  stiffness: 280,
  damping: 28,
  mass: 0.8,
}

const smoothTransition = {
  type: 'tween',
  ease: [0.16, 1, 0.3, 1],
  duration: 0.36,
}

export default function PageTransition({ children, variant = 'swipe' }) {
  const variantMap = {
    swipe: swipeVariants,
    fadeUp: fadeUpVariants,
    scale: scaleVariants,
  }

  const transitionMap = {
    swipe: smoothTransition,
    fadeUp: { type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.4 },
    scale: springTransition,
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={variantMap[variant] || swipeVariants}
      transition={transitionMap[variant] || smoothTransition}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  )
}

