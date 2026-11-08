import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Ported from original bundle (roman-statue-viewer): two cloned models, lights,
// entrance + ScrollTrigger-driven rotation/position animations.
export function initRomanViewer() {
  const el = document.querySelector('.roman-statue-viewer')
  if (!el) return { dispose() {} }

  let renderer, rafId
  const triggers = []
  try {
    const scene = new THREE.Scene()
    scene.background = null

    const w = () => Math.max(1, el.clientWidth || window.innerWidth)
    const h = () => Math.max(1, el.clientHeight || window.innerHeight || 1)
    const isMobile = window.innerWidth <= 768

    const camera = new THREE.PerspectiveCamera(35, w() / h(), 0.1, 100)
    camera.position.set(0, 0, isMobile ? 20 : 14)

    renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true })
    renderer.setSize(w(), h())
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    el.appendChild(renderer.domElement)

    // Lights (extracted)
    const key = new THREE.PointLight('#ff1f1f', 30, 15)
    key.position.set(0, 2, 5); scene.add(key)
    const fill = new THREE.PointLight('#ff1f1f', 60, 20)
    fill.position.set(3, 2, 4); scene.add(fill)
    const rim = new THREE.PointLight('#8b0000', 40, 15)
    rim.position.set(-3, 1, 3); scene.add(rim)
    scene.add(new THREE.AmbientLight('#b90707', 0.5))

    const group = new THREE.Group()
    scene.add(group)
    window.__romanStatue = { group, scene, camera }

    const Wi = { x: 0, y: 0 }
    const onMouse = (e) => {
      Wi.x = ((e.clientX / window.innerWidth) - 0.5) * 2
      Wi.y = ((e.clientY / window.innerHeight) - 0.5) * 2
      if (window.innerWidth <= 768) return
      // original: tweens on mousemove (desktop)
      gsap.to(group.rotation, { x: Wi.y * 0.08, y: Wi.x * 0.12, duration: 0.8, ease: 'power3.out', overwrite: 'auto' })
      gsap.to(group.position, { x: Wi.x * 0.2, y: 2.3 + Wi.y * 0.12, duration: 0.8, ease: 'power3.out', overwrite: 'auto' })
    }
    window.addEventListener('mousemove', onMouse)

    const loader = new GLTFLoader()
    loader.load('/assets/model1-hZVyFTy0.glb', (gltf) => {
      const base = gltf.scene // Qn
      const box = new THREE.Box3().setFromObject(base)
      const center = new THREE.Vector3(); box.getCenter(center)
      base.position.sub(center)
      const size = new THREE.Vector3(); box.getSize(size)
      const scale = 5.5 / Math.max(size.x, size.y, size.z || 1)
      base.scale.setScalar(scale)
      const clone = base.clone(true) // kr
      base.traverse((u) => { if (u.isMesh) { u.material = u.material.clone(); u.material.metalness = 0.25; u.material.roughness = 0.35; u.material.envMapIntensity = 1.8 } })
      clone.traverse((u) => { if (u.isMesh) { u.material = u.material.clone(); u.material.metalness = 0.45; u.material.roughness = 0.2; u.material.envMapIntensity = 2.5 } })
      base.position.x += -1.2; base.position.y += 3
      group.position.y += isMobile ? -2 : 1
      base.rotation.y += 3.1
      clone.position.x += 25; clone.position.y += 3
      group.add(base); group.add(clone)
      // Wh = reload in original. Gate entrance motion on preloader finish so it never starts early.
      const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0]
      const Wh = nav ? nav.type === 'reload' : false
      const d = Wh ? 0 : 5
      const s = new THREE.Box3().setFromObject(group); const a = new THREE.Vector3(); s.getCenter(a)
      base.position.sub(a); clone.position.sub(a)
      group.position.y = window.innerWidth <= 768 ? 0.3 : 1.3
      group.position.z = -2.5
      window.__romanStatue.base = base; window.__romanStatue.clone = clone
      const runEntrance = () => {
        gsap.to(clone.position, { x: 1.4, duration: 4, ease: 'power4.inOut', delay: d })
        gsap.to(base.position, { x: -1.4, duration: 4, ease: 'power4.inOut', delay: d })
        gsap.to(group.rotation, { x: -6.4, delay: d, duration: 5, ease: 'power2.out' })
      }
      if (window.__preloaderDone || Wh) { runEntrance() } else if (window.__preloaderDonePromise && window.__preloaderDonePromise.then) { window.__preloaderDonePromise.then(runEntrance) } else { setTimeout(runEntrance, 5500) }

      // ST16
      const st1 = gsap.to(group.rotation, { y: Math.PI * 10, ease: 'none', scrollTrigger: { trigger: '.roman-statue-viewer', start: 'top top', end: '900% top', scrub: true } })
      // ST17 (note: kr.rotation.x is -12.6 in original)
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.roman-statue-viewer', start: 'top top', end: () => (window.innerWidth <= 800 ? '270% bottom' : '450% bottom'), scrub: 0.8, invalidateOnRefresh: true } })
      tl.to(group.position, { z: 1, ease: 'none' }, 0)
        .to(base.rotation, { x: 12.6, ease: 'none' }, 0)
        .to(clone.rotation, { x: -12.6, ease: 'none' }, 0)
      triggers.push(st1.scrollTrigger, tl.scrollTrigger)
      ScrollTrigger.refresh()
    }, undefined, (err) => console.warn('roman model load failed', err))

    if (isMobile) scene.remove(key) // original: kl&&os.remove(zr) in render loop (do once)
    const tick = () => {
      rafId = requestAnimationFrame(tick)
      key.position.x += (Wi.x * 4 - key.position.x) * 0.08
      key.position.y += (Wi.y * 2 + 2 - key.position.y) * 0.08
      key.position.z = 5
      renderer.render(scene, camera)
    }
    tick()

    const onResize = () => {
      camera.aspect = w() / h(); camera.updateProjectionMatrix(); renderer.setSize(w(), h())
    }
    window.addEventListener('resize', onResize)

    return {
      dispose() {
        cancelAnimationFrame(rafId)
        window.removeEventListener('mousemove', onMouse)
        window.removeEventListener('resize', onResize)
        triggers.forEach((t) => { try { t && t.kill && t.kill() } catch {} })
        try { renderer.dispose() } catch {}
        try { renderer.domElement?.parentNode?.removeChild(renderer.domElement) } catch {}
      },
    }
  } catch (e) {
    console.warn('roman viewer init failed', e)
    return { dispose() {} }
  }
}
