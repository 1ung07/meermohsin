import gsap from 'gsap'

const blogData = [
  { title: 'Designing Through Motion', date: 'July 1, 2026', desc: "Motion is more than animation\u2014it is a storytelling tool that transforms ordinary interfaces into memorable digital experiences. Every transition, hover effect, and scroll interaction guides the user's attention while creating rhythm, emotion, and clarity. By carefully balancing timing, easing, and visual hierarchy, designers can make products feel intuitive, immersive, and alive. Thoughtful motion not only enhances usability but also builds stronger emotional connections between users and digital products, turning simple interactions into engaging journeys that leave a lasting impression.", author: 'MEER MOHSIN', img: '/assets/services-4-yGPU2s6w.webp' },
  { title: 'The Power of Cinematic Interfaces', date: 'June 14, 2026', desc: 'Cinematic interfaces combine visual storytelling with modern web technology to create experiences that feel immersive from the very first interaction. Through the use of dramatic typography, layered depth, lighting, subtle camera movement, smooth transitions, and atmospheric effects, designers can evoke emotion while guiding users naturally through content. Rather than simply displaying information, cinematic design creates anticipation, curiosity, and engagement, allowing every scroll and interaction to feel like a carefully directed scene in a film.', author: 'MEER MOHSIN', img: '/assets/blog-1-CMrv0Xey.avif' },
  { title: 'Crafting Emotion With Color', date: 'May 22, 2026', desc: 'Color plays a powerful role in shaping perception, influencing mood, and reinforcing brand identity. Beyond aesthetics, every shade communicates emotion, builds trust, and directs user attention throughout an interface. Understanding color psychology allows designers to create experiences that feel calm, energetic, luxurious, or bold depending on the intended message. When combined with thoughtful typography, contrast, spacing, and motion, color becomes a silent language that enhances usability while creating unforgettable visual experiences.', author: 'MEER MOHSIN', img: '/assets/work-1-BTj91zts.avif' },
]

export function initModals(getLenis) {
  const disposers = []
  const lenis = () => (typeof getLenis === 'function' ? getLenis() : window.lenis)

  // Contact
  const contactOpen = document.getElementById('contactopen') || document.querySelector('.cta-connect')
  const contactModal = document.querySelector('.modal-contact-us')
  const contactClose = document.querySelector('.close-sidebar-contact')
  let contactOn = false
  if (contactModal) {
    gsap.set(contactModal, { visibility: 'hidden' })
    const open = () => {
      if (contactOn) return; contactOn = true; lenis()?.stop?.()
      gsap.set(contactModal, { visibility: 'visible' })
      gsap.fromTo(contactModal, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut' })
      gsap.from('.modal-contact-us h1, .modal-contact-us .cta-footer, .modal-contact-us form', { y: 60, opacity: 0, stagger: 0.08, duration: 0.8, delay: 0.35, ease: 'power3.out', overwrite: 'auto' })
    }
    const close = () => { if (!contactOn) return; contactOn = false; gsap.to(contactModal, { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.7, ease: 'power4.inOut', onComplete: () => { gsap.set(contactModal, { visibility: 'hidden' }); lenis()?.start?.() } }) }
    contactOpen?.addEventListener('click', open); contactClose?.addEventListener('click', close)
    const esc = (e) => { if (e.key === 'Escape') close() }; window.addEventListener('keydown', esc)
    disposers.push(() => { contactOpen?.removeEventListener('click', open); contactClose?.removeEventListener('click', close); window.removeEventListener('keydown', esc) })
  }

  // Blog (with data population from bundle)
  const blogModal = document.querySelector('.modal-blogs')
  const blogClose = document.querySelector('.close-sidebar-blog')
  if (blogModal) {
    gsap.set(blogModal, { visibility: 'hidden', autoAlpha: 0 })
    const QE = blogModal.querySelector('.content-blogs h1')
    const eM = blogModal.querySelector('.Date-blog')
    const tM = blogModal.querySelector('.content-blogs p')
    const nM = blogModal.querySelector('.by-who')
    const iM = blogModal.querySelector('.modal-blogs .image-blog img') || blogModal.querySelector('.image-blog img')
    const cards = document.querySelectorAll('.blog-section .card-1')
    cards.forEach((r, e) => { const t = r.querySelector('img'); if (t && blogData[e]) t.src = blogData[e].img })
    const close = () => gsap.to(blogModal, { autoAlpha: 0, duration: 0.4, onComplete: () => { gsap.set(blogModal, { visibility: 'hidden' }); lenis()?.start?.() } })
    const open = (idx) => {
      const d = blogData[idx] || blogData[0]
      if (QE) QE.textContent = d.title; if (eM) eM.textContent = d.date; if (tM) tM.textContent = d.desc; if (nM) nM.textContent = d.author; if (iM && d.img) iM.src = d.img
      lenis()?.stop?.(); gsap.set(blogModal, { visibility: 'visible', autoAlpha: 1 }); gsap.fromTo(blogModal, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
    }
    cards.forEach((el, idx) => { const fn = () => open(idx); el.addEventListener('click', fn); disposers.push(() => el.removeEventListener('click', fn)) })
    blogClose?.addEventListener('click', close)
  }

  // Case study
  const caseSidebar = document.querySelector('.case-study-side-bar')
  const caseClose = document.querySelector('.close-sidebar')
  if (caseSidebar) {
    gsap.set(caseSidebar, { xPercent: 100, visibility: 'hidden' })
    const open = () => { lenis()?.stop?.(); gsap.set(caseSidebar, { visibility: 'visible' }); gsap.to(caseSidebar, { xPercent: 0, duration: 0.8, ease: 'power4.out' }) }
    const close = () => gsap.to(caseSidebar, { xPercent: 100, duration: 0.7, ease: 'power4.in', onComplete: () => { gsap.set(caseSidebar, { visibility: 'hidden' }); lenis()?.start?.() } })
    const triggers = document.querySelectorAll('.container .step, .circle-follow-view')
    triggers.forEach((el) => el.addEventListener('click', open))
    caseClose?.addEventListener('click', close)
    disposers.push(() => triggers.forEach((el) => el.removeEventListener('click', open)))
  }

  return { dispose() { disposers.forEach((d) => d()) } }
}
