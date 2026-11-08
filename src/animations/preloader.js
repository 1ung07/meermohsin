import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initPreloader(getLenis) {
  const preloader = document.querySelector('.site-pre-loader')
  const numberCount = document.querySelector('.number-count')
  // completion signal for animations that must wait (e.g. 3D model entrance)
  let resolveDone
  window.__preloaderDonePromise = window.__preloaderDonePromise || new Promise((res) => { resolveDone = res })
  const markDone = () => { window.__preloaderDone = true; try { resolveDone && resolveDone() } catch {} }
  if (!preloader) { markDone(); return { dispose() {} } }
  const lenis = () => (typeof getLenis === 'function' ? getLenis() : window.lenis)
  lenis()?.stop?.()
  let done = false
  const finish = () => {
    if (done) return; done = true
    markDone()
    lenis()?.start?.()
    gsap.to(preloader, { opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => { preloader.style.display = 'none'; preloader.style.pointerEvents = 'none'; ScrollTrigger.refresh() } })
  }
  let prog = 0
  const iv = setInterval(() => { prog = Math.min(100, prog + Math.ceil(Math.random() * 7)); if (numberCount) numberCount.textContent = String(prog).padStart(3, '0'); if (prog >= 100) clearInterval(iv) }, 60)
  const onActivate = () => { document.getElementById('bgMusic')?.play?.().catch(() => {}); clearInterval(iv); if (numberCount) numberCount.textContent = '100'; setTimeout(finish, 250) }
  preloader.addEventListener('click', onActivate, { once: true })
  const to = setTimeout(() => { if (!done) finish() }, 6000)
  return { dispose() { clearInterval(iv); clearTimeout(to) } }
}
