import { useEffect, useRef } from 'react'

/**
 * Intersection Observer hook that adds animate-fade-in class when element enters viewport
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in')
            entry.target.style.opacity = '1'
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        ...options,
      }
    )

    element.style.opacity = '0'
    observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [options.threshold, options.rootMargin])

  return ref
}

export default useScrollReveal
