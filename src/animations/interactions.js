import gsap from 'gsap'

export function initInteractions(getLenis) {
  const disposers = []
  const lenis = () => (typeof getLenis === 'function' ? getLenis() : window.lenis)

  // CTA connect - hover parallax + click (original opened WhatsApp)
  const Xa = document.querySelector('.cta-connect')
  if (Xa) {
    gsap.to(Xa, { opacity: 1, delay: 0.2 })
    const move = (r) => {
      const e = Xa.getBoundingClientRect(), t = r.clientX - e.left - e.width / 2, n = r.clientY - e.top - e.height / 2
      gsap.to(Xa, { x: t * 0.2, y: n * 0.2, duration: 0.4, ease: 'power3.out' })
    }
    const leave = () => gsap.to(Xa, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' })
    const click = () => window.open('https://wa.me/447405341759', '_blank')
    Xa.addEventListener('mousemove', move); Xa.addEventListener('mouseleave', leave); Xa.addEventListener('click', click)
    disposers.push(() => { Xa.removeEventListener('mousemove', move); Xa.removeEventListener('mouseleave', leave); Xa.removeEventListener('click', click) })
  }

  // Social links
  ;[['tiktok-link','https://www.tiktok.com/@meermohsin.me'],['instagram-link','https://www.instagram.com/meermohsin.me/'],['Behance-link','https://www.behance.net/meermohsin4']].forEach(([id, url]) => {
    const el = document.getElementById(id); if (!el) return
    const fn = () => window.open(url, '_blank'); el.addEventListener('click', fn); disposers.push(() => el.removeEventListener('click', fn))
  })

  // Active animate / menu smooth scroll via Lenis
  document.querySelectorAll('.active-animate, .menu-navigate-scroll a').forEach((r) => {
    const fn = (e) => {
      const t = r.getAttribute('href'); if (!t || t === '#' || !t.startsWith('#')) return
      e.preventDefault(); const n = document.querySelector(t); if (!n) return
      const l = lenis(); if (l && l.scrollTo) l.scrollTo(n, { duration: window.innerWidth < 768 ? 1.5 : 2.5, easing: (s) => 1 - Math.pow(1 - s, 4) })
      else n.scrollIntoView({ behavior: 'smooth' })
    }
    r.addEventListener('click', fn); disposers.push(() => r.removeEventListener('click', fn))
  })

  // Menu nav link plus-rotates hover (extracted)
  document.querySelectorAll('.menu-navigate-scroll a').forEach((r) => {
    const fn = () => {
      gsap.to('.plus-rotates', { scale: 0, rotation: 0, duration: 0.3, ease: 'power3.out' })
      const pr = r.querySelector('.plus-rotates'); if (pr) gsap.to(pr, { scale: 1.1, rotation: 180, duration: 0.4, ease: 'back.out(2)' })
    }
    r.addEventListener('click', fn); disposers.push(() => r.removeEventListener('click', fn))
  })

  // Scroll-driven plus-rotate images (extracted)
  const hM = document.querySelectorAll('.plus-rotate img')
  if (hM.length) {
    let yg = window.scrollY, Sg = 0
    const onScroll = () => { const r = window.scrollY, e = r - yg; Sg += e * 0.3; hM.forEach((t) => { t.style.transform = `rotate(${Sg}deg)` }); yg = r }
    window.addEventListener('scroll', onScroll, { passive: true })
    disposers.push(() => window.removeEventListener('scroll', onScroll))
  }

  // Nav hover (plus-for-hover) - subtle
  document.querySelectorAll('nav ul li').forEach((li) => {
    const plus = li.querySelector('.plus-for-hover img')
    if (!plus) return
    const enter = () => gsap.to(plus, { rotation: 90, scale: 1.1, duration: 0.3 })
    const leave = () => gsap.to(plus, { rotation: 0, scale: 1, duration: 0.3 })
    li.addEventListener('mouseenter', enter); li.addEventListener('mouseleave', leave)
    disposers.push(() => { li.removeEventListener('mouseenter', enter); li.removeEventListener('mouseleave', leave) })
  })

  return { dispose() { disposers.forEach((d) => d()) } }
}
