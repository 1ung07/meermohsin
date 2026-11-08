import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(ScrollTrigger, Observer)

export function useGsap(effect, deps = [], scopeRef) {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      effect(gsap, ScrollTrigger, Observer)
    }, scopeRef?.current || undefined)
    return () => ctx.revert()
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}

export { gsap, ScrollTrigger, Observer }
