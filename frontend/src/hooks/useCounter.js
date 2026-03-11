import { useState, useEffect, useRef } from 'react'

/**
 * Animates number from 0 to target over duration milliseconds
 */
export function useCounter(target, duration = 2000, startOnMount = true) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const frameRef = useRef(null)
  const startTimeRef = useRef(null)

  const start = () => {
    setHasStarted(true)
    startTimeRef.current = null
    setCount(0)
  }

  useEffect(() => {
    if (startOnMount) {
      setHasStarted(true)
    }
  }, [startOnMount])

  useEffect(() => {
    if (!hasStarted) return

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [hasStarted, target, duration])

  return { count, start }
}

export default useCounter
