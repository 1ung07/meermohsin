import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function useThreeScene(init, deps = []) {
  const containerRef = useRef(null)
  useEffect(() => {
    const container = containerRef.current
    if (!container || typeof init !== 'function') return
    const api = init({ container, THREE }) || {}
    return () => {
      try { api.dispose?.() } catch {}
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
  return containerRef
}
