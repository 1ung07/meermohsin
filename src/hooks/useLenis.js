import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useLenis({ autoRaf = true } = {}) {
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis
    window.lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const update = (time) => lenis.raf(time * 1000)
    if (autoRaf) {
      gsap.ticker.add(update)
      gsap.ticker.lagSmoothing(0)
    }
    return () => {
      if (autoRaf) gsap.ticker.remove(update)
      lenis.destroy()
      window.lenis = null
      lenisRef.current = null
    }
  }, [autoRaf])

  return lenisRef
}
