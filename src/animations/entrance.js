import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function splitLines(el) {
  if (!el || el.dataset.splitLines === '1') return el.querySelectorAll('.line')
  const text = el.innerHTML
  // simple: split by <br> or treat whole as one line if none
  if (/<br\s*\/? ?>/.test(text)) {
    const parts = text.split(/<br\s*\/? ?>/i)
    el.innerHTML = parts.map((p) => `<span class="line" style="display:block;overflow:hidden"><span style="display:inline-block">${p}</span></span>`).join('')
  } else {
    el.innerHTML = `<span class="line" style="display:block;overflow:hidden"><span style="display:inline-block">${text}</span></span>`
  }
  el.dataset.splitLines = '1'
  return el.querySelectorAll('.line > span')
}

export function initEntrance() {
  // entrance animations (extracted from bundle: para-introduce-hero/expertise-text lines, scrolling-text rail, face-image, plus-rotate)
  try { gsap.to('.scrolling-text .rail h4', { y: 0, delay: 0.2, duration: 2 }) } catch {}
  const para = document.querySelector('.para-introduce-hero')
  if (para) {
    const lines = splitLines(para)
    if (lines.length) { gsap.set(lines, { yPercent: 100, opacity: 0, filter: 'blur(4px)' }); gsap.to(lines, { yPercent: 0, opacity: 1, stagger: 0.01, duration: 1.5, ease: 'power3.out', delay: 0.2, filter: 'blur(0px)' }) }
  }
  const exp = document.querySelector('.expertise-text')
  if (exp && !exp.dataset.splitLines) {
    // split by newlines/spans into line-like reveals
    const children = [...exp.children]
    if (children.length) { gsap.set(children, { yPercent: 100, opacity: 0, filter: 'blur(4px)' }); gsap.to(children, { yPercent: 0, opacity: 1, stagger: 0.03, duration: 1.5, ease: 'power3.out', delay: 0.2, filter: 'blur(0px)' }) }
    exp.dataset.splitLines = '1'
  }
  gsap.to('.plus-rotate', { rotate: 0, duration: 1, scale: 1, ease: 'power3.out', delay: 0.2 })
  gsap.to('.face-image', { y: 0, duration: 3.5, filter: 'brightness(1)', scale: 1, delay: 0.2 })
  gsap.to('.menu-2-bar', { opacity: 1, pointerEvents: 'auto', duration: 1.5, ease: 'power3.out', delay: 0.2 })
  gsap.to('.logo-3d', { opacity: 1, delay: 0.2 })
  // sound-follow pulse (extracted)
  gsap.fromTo('.sound-follow', { opacity: 0 }, { opacity: 1, duration: 4, ease: 'power1.inOut', repeat: -1, yoyo: true })

  // active-animate chars (nav/footer) - entrance + footer/scroll behavior (extracted)
  initActiveAnimate()

  return { dispose() {} }
}

function splitCharsInline(el) {
  if (!el || el.dataset.activeSplit === '1') return el?.querySelectorAll?.('.char') || []
  const text = el.textContent || ''
  el.innerHTML = [...text].map((ch) => `<span class="char" style="display:inline-block">${ch === ' ' ? '\u00A0' : ch}</span>`).join('')
  el.dataset.activeSplit = '1'
  return el.querySelectorAll('.char')
}

function initActiveAnimate() {
  const els = document.querySelectorAll('.active-animate')
  if (!els.length) return
  const allChars = []
  els.forEach((el) => allChars.push(...splitCharsInline(el)))
  if (!allChars.length) return
  gsap.set(allChars, { yPercent: 100, opacity: 0 })
  gsap.to(allChars, { yPercent: 0, opacity: 1, stagger: 0.03, duration: 0.8, ease: 'power3.out', delay: 0.2 })
  let d_
  const p_ = () => gsap.to(allChars, { yPercent: 0, duration: 0.35, ease: 'power3.out', overwrite: true })
  const AP = () => gsap.to(allChars, { yPercent: 100, duration: 0.35, ease: 'power3.out', overwrite: true })
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (r) => { try { if (ScrollTrigger.isInViewport('#footer')) return } catch {} clearTimeout(d_); r.direction === 1 ? AP() : p_(); d_ = setTimeout(() => p_(), 3000) } })
  ScrollTrigger.create({ trigger: '.footer-hit', scrub: true, start: 'top bottom', onEnter: () => gsap.to(allChars, { yPercent: 0, opacity: 1, stagger: 0.03, duration: 0.5, pointerEvents: 'auto', ease: 'power2.out', overwrite: true }), onEnterBack: () => gsap.to(allChars, { yPercent: 100, opacity: 0, pointerEvents: 'none', duration: 0.5, ease: 'power2.out', overwrite: true }) })
}
