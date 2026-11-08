import gsap from 'gsap'

export function initNavigation() {
  const menuBar = document.querySelector('.menu-2-bar')
  const navMenu = document.querySelector('.navigation-menu')
  if (!menuBar || !navMenu) return { dispose() {} }
  let open = false
  const openMenu = () => {
    open = true
    gsap.set(navMenu, { visibility: 'visible', pointerEvents: 'auto' })
    gsap.to('.bar-bgs', { scaleX: 1, transformOrigin: 'left center', duration: 0.8, stagger: 0.06, ease: 'power4.inOut' })
    gsap.fromTo('.menu-navigate-scroll a', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, delay: 0.2 })
  }
  const closeMenu = () => {
    open = false
    gsap.to('.menu-navigate-scroll a', { y: 20, opacity: 0, duration: 0.25, stagger: 0.02 })
    gsap.to('.bar-bgs', { scaleX: 0, transformOrigin: 'left center', duration: 0.7, stagger: 0.05, delay: 0.1, ease: 'power4.inOut', onComplete: () => gsap.set(navMenu, { visibility: 'hidden', pointerEvents: 'none' }) })
  }
  const toggle = () => (open ? closeMenu() : openMenu())
  const onEsc = (e) => { if (e.key === 'Escape' && open) closeMenu() }
  menuBar.addEventListener('click', toggle)
  window.addEventListener('keydown', onEsc)
  const links = document.querySelectorAll('.menu-navigate-scroll a')
  const onLink = () => { if (open) closeMenu() }
  links.forEach((a) => a.addEventListener('click', onLink))
  return { dispose() { menuBar.removeEventListener('click', toggle); window.removeEventListener('keydown', onEsc); links.forEach((a) => a.removeEventListener('click', onLink)) } }
}
