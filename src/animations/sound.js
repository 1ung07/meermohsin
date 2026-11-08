export function initSound() {
  const soundWave = document.querySelector('.sound-wave')
  const bgMusic = document.getElementById('bgMusic')
  if (!soundWave) return { dispose() {} }
  if (!soundWave.querySelector('.bar')) {
    for (let i = 0; i < 40; i++) { const b = document.createElement('div'); b.className = 'bar'; b.style.animationDuration = `${Math.random() * 0.5 + 0.2}s`; b.style.animationDelay = `${Math.random() * 0.5}s`; soundWave.appendChild(b) }
  }
  let playing = false
  if (bgMusic) { bgMusic.loop = true; bgMusic.volume = 0.6 }
  const toggle = () => { playing = !playing; if (playing) bgMusic?.play?.().catch(()=>{}); else bgMusic?.pause?.(); soundWave.classList.toggle('active', playing) }
  soundWave.addEventListener('click', toggle)
  return { dispose() { soundWave.removeEventListener('click', toggle) } }
}
