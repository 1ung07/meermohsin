export function initCursor() {
  const cursor = document.querySelector('.custom-cursor')
  if (!cursor || window.innerWidth <= 800) return { dispose() {} }
  const move = (e) => {
    cursor.style.left = `${e.clientX}px`
    cursor.style.top = `${e.clientY}px`
    cursor.style.opacity = '1'
  }
  const leave = () => { cursor.style.opacity = '0' }
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseleave', leave)
  return { dispose() { window.removeEventListener('mousemove', move); window.removeEventListener('mouseleave', leave) } }
}
