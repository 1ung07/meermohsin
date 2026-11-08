import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initLenis } from '../animations/lenisSetup'
import { initPreloader } from '../animations/preloader'
import { initCursor } from '../animations/cursor'
import { initNavigation } from '../animations/navigation'
import { initModals } from '../animations/modals'
import { initSound } from '../animations/sound'
import { initRomanViewer } from '../animations/romanViewer'
import { initScrollAnimations } from '../animations/scrollAnimations'
import { initFluid2 } from '../animations/fluidCanvas'
import { initInteractions } from '../animations/interactions'
import { initEntrance } from '../animations/entrance'
import { initRecognitions3D } from '../animations/recognitions3d'

// Coordinator: animation/interaction logic ported from the original HTML project bundle
// (index-BXnpqJiu.js) into modular, React-lifecycle-safe units. No bundle-mirroring at runtime.
// Complex WebGL sims (e.g. fluid2) are preserved by extracting the original implementation.
export function initSiteEffects() {
  if (typeof window === 'undefined') return () => {}
  if (window.__siteEffectsInit) return () => {}
  window.__siteEffectsInit = true

  const disposers = []
  let lenisApi
  try { lenisApi = initLenis(); disposers.push(() => lenisApi?.dispose?.()) } catch (e) { console.warn('Lenis init failed', e) }
  const getLenis = () => lenisApi?.lenis || window.lenis

  try { disposers.push(initPreloader(getLenis)) } catch (e) { console.warn(e) }
  try { disposers.push(initCursor()) } catch (e) { console.warn(e) }
  try { disposers.push(initNavigation()) } catch (e) { console.warn(e) }
  try { disposers.push(initModals(getLenis)) } catch (e) { console.warn(e) }
  try { disposers.push(initSound()) } catch (e) { console.warn(e) }
  try { disposers.push(initInteractions(getLenis)) } catch (e) { console.warn(e) }
  try { disposers.push(initFluid2()) } catch (e) { console.warn(e) }
  try { disposers.push(initRomanViewer()) } catch (e) { console.warn(e) }
  try { disposers.push(initEntrance()) } catch (e) { console.warn(e) }
  try { disposers.push(initScrollAnimations()) } catch (e) { console.warn(e) }
  try { disposers.push(initRecognitions3D()) } catch (e) { console.warn(e) }

  ScrollTrigger.refresh()
  setTimeout(() => ScrollTrigger.refresh(), 800)

  return () => {
    window.__siteEffectsInit = false
    disposers.reverse().forEach((d) => { try { d?.dispose?.() } catch {} })
    try { ScrollTrigger.getAll().forEach((t) => t.kill()) } catch {}
  }
}
