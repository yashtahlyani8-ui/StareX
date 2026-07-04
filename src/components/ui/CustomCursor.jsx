import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isTouch, setIsTouch] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isLink, setIsLink] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  const x = useSpring(mouseX, { stiffness: 1400, damping: 72 })
  const y = useSpring(mouseY, { stiffness: 1400, damping: 72 })
  const rx = useSpring(mouseX, { stiffness: 180, damping: 22 })
  const ry = useSpring(mouseY, { stiffness: 180, damping: 22 })

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) { setIsTouch(true); return }
    document.documentElement.style.cursor = 'none'

    const move = e => { mouseX.set(e.clientX); mouseY.set(e.clientY); setVisible(true) }
    const over = e => setIsLink(!!e.target.closest('a,button,[role="button"],input,select,textarea,label,[tabindex]'))
    const down = () => setIsClicking(true)
    const up = () => setIsClicking(false)
    const leave = () => setVisible(false)
    const enter = () => setVisible(true)

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    document.documentElement.addEventListener('mouseleave', leave)
    document.documentElement.addEventListener('mouseenter', enter)

    return () => {
      document.documentElement.style.cursor = ''
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.documentElement.removeEventListener('mouseleave', leave)
      document.documentElement.removeEventListener('mouseenter', enter)
    }
  }, [])

  if (isTouch) return null

  return (
    <>
      {/* white + mix-blend-mode:difference = dark on light bg, white on dark bg — always visible */}
      <motion.div
        animate={{ width: isClicking ? 5 : isLink ? 10 : 7, height: isClicking ? 5 : isLink ? 10 : 7, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.1, ease: 'easeOut' }}
        style={{
          position: 'fixed', pointerEvents: 'none', zIndex: 99999,
          x, y, translateX: '-50%', translateY: '-50%',
          borderRadius: '50%', background: 'white', mixBlendMode: 'difference',
        }}
      />
      {/* lagged ring — only on interactive hover */}
      <motion.div
        animate={{ width: visible && isLink ? 38 : 0, height: visible && isLink ? 38 : 0, opacity: visible && isLink ? 1 : 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        style={{
          position: 'fixed', pointerEvents: 'none', zIndex: 99998,
          x: rx, y: ry, translateX: '-50%', translateY: '-50%',
          borderRadius: '50%', border: '1.5px solid white', mixBlendMode: 'difference',
        }}
      />
    </>
  )
}
