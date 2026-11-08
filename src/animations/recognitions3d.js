import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Ported 1:1 (values) from original bundle ST21 (regonizations-canvas).
// Pin + panel animation are created immediately (so scroll-down entry works even before GLB loads).
// Camera tweens use a mutable v (model fit distance) resolved when the floor GLB loads.
export function initRecognitions3D() {
  const el = document.querySelector('.regonizations-canvas')
  if (!el) return { dispose() {} }
  let renderer, raf
  const triggers = []
  try {
    const scene = new THREE.Scene()
    const w = () => Math.max(1, el.clientWidth)
    const h = () => Math.max(1, el.clientHeight || 1)
    const camera = new THREE.PerspectiveCamera(45, w() / h(), 0.01, 1000)
    camera.position.set(3, 2, 5)
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setSize(w(), h())
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.shadowMap.enabled = false // original ends disabled
    el.appendChild(renderer.domElement)

    // lights (extracted): Hemisphere(0xffffff,0x222222,2), Dir(0xff22dc,4)@(5,8,6), Dir(0xff22dc,2)@(0,8,-8)
    scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 2))
    const ea = new THREE.DirectionalLight(0xff22dc, 4); ea.position.set(5, 8, 6); scene.add(ea)
    const Cv = new THREE.DirectionalLight(0xff22dc, 2); Cv.position.set(0, 8, -8); scene.add(Cv)

    // mutable model-fit distance; updated when GLB loads (camera z tweens read it via functions)
    const vState = { v: 5, ready: false }

    // explicit initial state for panels (prevents direction/immediateRender glitches)
    gsap.set('.split-panel-left, .split-panel-right', { xPercent: 0 })

    // ST21 timeline (extracted 1:1 values) — created immediately so pin works on scroll-down
    const b = gsap.timeline({ scrollTrigger: { trigger: '.regonizations', start: 'top top', end: () => '+=' + window.innerHeight * 4.5, scrub: 0.4, pin: true, invalidateOnRefresh: true } })
    b.to(camera.position, { x: 0.2, y: 0.1, immediateRender: false }, '0.2')
    b.to(camera.position, { z: () => (window.innerWidth <= 768 ? vState.v * 0.96 : vState.v * 0.66), immediateRender: false }, '0.2')
    b.to(camera.rotation, { y: () => (window.innerWidth <= 768 ? -0.41 : -0.6), immediateRender: false }, '0.2')
    b.to(camera.position, { x: -0.1, immediateRender: false }, '1')
    b.to(camera.rotation, { y: () => (window.innerWidth <= 768 ? 0.47 : 0.6), immediateRender: false }, '1')
    b.to(camera.rotation, { y: 0, x: 0.1, immediateRender: false }, '2')
    b.to(camera.position, { x: 0, immediateRender: false }, '2')
    b.to(camera.position, { z: () => (window.innerWidth <= 768 ? vState.v * 0.6 : vState.v * 0.3), immediateRender: false }, '2')
    b.to('.split-panel-left', { xPercent: -100, ease: 'none', immediateRender: false }, 0)
    b.to('.split-panel-right', { xPercent: 100, ease: 'none', immediateRender: false }, 0)
    b.to('.split-panel-left', { xPercent: 0, ease: 'none', immediateRender: false }, 3)
    b.to('.split-panel-right', { xPercent: 0, ease: 'none', immediateRender: false }, 3)
    b.to(camera.position, { z: () => vState.v * 1.5, ease: 'none', immediateRender: false }, 3)
    triggers.push(b.scrollTrigger)

    const texLoader = new THREE.TextureLoader()
    const loadAwardTex = (url) => new Promise((res) => texLoader.load(url, (t) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = renderer.capabilities.getMaxAnisotropy()
      t.minFilter = THREE.LinearMipmapLinearFilter
      t.magFilter = THREE.LinearFilter
      t.generateMipmaps = true
      t.needsUpdate = true
      res(t)
    }, undefined, () => res(null)))

    const gltf = new GLTFLoader()
    try { gltf.setMeshoptDecoder(MeshoptDecoder) } catch {}
    gltf.load('/assets/floor-Bfx8nsPH.glb', (gltfRes) => {
      const model = gltfRes.scene
      scene.add(model)
      model.traverse((S) => { if (S.isMesh) { S.castShadow = true; S.receiveShadow = true; if (S.material) S.material.needsUpdate = true } })

      // awards (extracted): uP=award-2 (-.7,.14,0 rotY .6), cP=award-1 (.7,.14,0 rotY -.6), hP=award-3 (0,.15,-.5)
      ;(async () => {
        const [uP, cP, hP] = await Promise.all([
          loadAwardTex('/assets/award-2-DUR0STCu.avif'),
          loadAwardTex('/assets/award-1-CSzIohE8.avif'),
          loadAwardTex('/assets/award-3-Cf31u9yw.avif'),
        ])
        const addPlane = (map, pos, rotY = 0) => { if (!map) return; const m = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.5), new THREE.MeshBasicMaterial({ map, side: THREE.DoubleSide })); m.position.set(...pos); m.rotation.set(0, rotY, 0); scene.add(m) }
        addPlane(uP, [-0.7, 0.14, 0], 0.6)
        addPlane(cP, [0.7, 0.14, 0], -0.6)
        addPlane(hP, [0, 0.15, -0.5], 0)
      })()

      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3()); const center = box.getCenter(new THREE.Vector3())
      model.position.sub(center); model.position.set(0, -0.11, 0); model.rotation.set(-1.56, 0, 0)
      const x = Math.max(size.x, size.y, size.z)
      vState.v = x * 0.6
      vState.ready = true
      camera.position.set(0, 0, vState.v); camera.lookAt(0, 0, 0)
      camera.near = x / 100; camera.far = x * 100; camera.updateProjectionMatrix()
      b.invalidate()
      ScrollTrigger.refresh()
    }, undefined, (e) => console.warn('recognitions model load failed', e))

    const onResize = () => { camera.aspect = w() / h(); camera.updateProjectionMatrix(); renderer.setSize(w(), h()); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6)) }
    window.addEventListener('resize', onResize)
    const tick = () => { raf = requestAnimationFrame(tick); renderer.render(scene, camera) }; tick()
    return { dispose() { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); triggers.forEach((t) => t && t.kill && t.kill()); try { renderer.dispose() } catch {}; renderer.domElement?.remove() } }
  } catch (e) { console.warn('recognitions init failed', e); return { dispose() {} } }
}
