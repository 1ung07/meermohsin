// Loads the original built animation/interaction bundle from the mirrored HTML project.
// This reuses the complete, original animation logic (GSAP/ScrollTrigger/Lenis/Three/canvas/etc.)
// as the foundation, running it against the same DOM structure rendered by React.
// We load it once, after React mounts, to avoid conflicts with React lifecycle and double init.
let loaded = false

export function loadOriginalBundle() {
  if (typeof window === 'undefined') return
  if (loaded || window.__originalBundleLoaded) return
  if (document.querySelector('script[data-original-bundle="1"]')) {
    loaded = true
    window.__originalBundleLoaded = true
    return
  }
  loaded = true
  window.__originalBundleLoaded = true
  const script = document.createElement('script')
  script.type = 'module'
  script.src = '/assets/index-BXnpqJiu.js'
  script.dataset.originalBundle = '1'
  script.onerror = (e) => console.error('Failed to load original animation bundle', e)
  document.body.appendChild(script)
}

export function shouldUseOriginalBundle() {
  try {
    const p = new URLSearchParams(window.location.search)
    if (p.get('no-original') === '1') return false
  } catch {}
  return true
}
