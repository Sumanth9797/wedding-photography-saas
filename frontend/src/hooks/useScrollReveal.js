import { useEffect, useRef } from 'react'

/**
 * Intersection Observer hook that triggers reveal animations
 * when elements enter the viewport.
 * Supports 'reveal', 'reveal-left', 'reveal-right', 'reveal-scale',
 * 'animate-on-scroll' class names.
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
            // Support multiple reveal class types
            entry.target.classList.add('visible')
            entry.target.style.opacity = '1'
            observer.unobserve(entry.target)

            // Also trigger staggered children if present
            const staggered = entry.target.querySelectorAll(
              '.reveal, .reveal-left, .reveal-right, .reveal-scale, .animate-on-scroll'
            )
            staggered.forEach((child, i) => {
              setTimeout(() => {
                child.classList.add('visible')
                child.style.opacity = '1'
              }, i * 80)
            })
          }
        })
      },
      {
        threshold: options.threshold ?? 0.08,
        rootMargin: options.rootMargin ?? '0px 0px -40px 0px',
      }
    )

    // Ensure the element starts invisible
    if (!element.classList.contains('visible')) {
      element.style.opacity = '0'
    }
    observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}

/**
 * Attach scroll reveal to ALL elements matching selector inside a container.
 * Useful for grids and lists.
 */
export function useScrollRevealChildren(selector = '.reveal', options = {}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const elements = container.querySelectorAll(selector)
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible')
              entry.target.style.opacity = '1'
            }, idx * 70)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: options.threshold ?? 0.05,
        rootMargin: options.rootMargin ?? '0px 0px -30px 0px',
      }
    )

    elements.forEach((el) => {
      if (!el.classList.contains('visible')) {
        el.style.opacity = '0'
      }
      observer.observe(el)
    })

    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector])

  return containerRef
}

export default useScrollReveal
