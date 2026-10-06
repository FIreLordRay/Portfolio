import { useRef, useState } from 'react'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const DURATION_MS = 500

/**
 * Text that scrambles on hover and settles back, letter by letter from the left: the effect
 * the first version of this site had on my name (after Magic UI's HyperText, MIT License).
 * At rest it's the plain text, once. Give the surrounding element an aria-label with the
 * text, so screen readers never hear the scramble. With reduced motion it stays still.
 *
 * @param {{ text: string }} props
 */
export default function HyperText({ text }) {
  const [scrambled, setScrambled] = useState(null) // null when at rest
  const running = useRef(false)

  const scramble = () => {
    if (running.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    running.current = true
    const start = performance.now()
    const frame = (now) => {
      const progress = Math.min((now - start) / DURATION_MS, 1)
      const revealed = progress * text.length
      if (progress < 1) {
        setScrambled(
          [...text].map((ch, i) => (ch === ' ' || i <= revealed ? ch : LETTERS[Math.floor(Math.random() * LETTERS.length)])).join(''),
        )
        requestAnimationFrame(frame)
      } else {
        setScrambled(null)
        running.current = false
      }
    }
    requestAnimationFrame(frame)
  }

  return <span onMouseEnter={scramble}>{scrambled ?? text}</span>
}
