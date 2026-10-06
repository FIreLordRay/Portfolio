import { useCallback, useEffect, useRef, useState } from 'react'

const GRID = 16 // cells per side
const SIZE = 320 // canvas pixels per side
const CELL = SIZE / GRID
const TICK_MS = 120
const MOVES = {
  arrowup: [0, -1],
  w: [0, -1],
  arrowdown: [0, 1],
  s: [0, 1],
  arrowleft: [-1, 0],
  a: [-1, 0],
  arrowright: [1, 0],
  d: [1, 0],
}

/** A random empty cell for the food, or null when the snake fills the board. */
function placeFood(snake) {
  const free = []
  for (let x = 0; x < GRID; x++)
    for (let y = 0; y < GRID; y++) if (!snake.some((part) => part.x === x && part.y === y)) free.push({ x, y })
  return free.length ? free[Math.floor(Math.random() * free.length)] : null
}

/**
 * snake.exe: a little game beside my name, just for fun. Arrow keys or WASD steer, and only
 * while a game is running, so the page scrolls normally the rest of the time.
 */
export default function Snake({ className = '' }) {
  const canvas = useRef(null)
  const game = useRef(null) // the snake, its heading and the food: changes every tick, so not state
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState('idle') // idle | playing | over

  const draw = useCallback(() => {
    const ctx = canvas.current?.getContext('2d')
    if (!ctx) return
    const css = getComputedStyle(document.documentElement)
    const color = (name, fallback) => css.getPropertyValue(name).trim() || fallback

    ctx.fillStyle = color('--color-panel', '#0a0706')
    ctx.fillRect(0, 0, SIZE, SIZE)
    ctx.strokeStyle = 'rgb(255 255 255 / 0.04)'
    ctx.beginPath()
    for (let i = 1; i < GRID; i++) {
      ctx.moveTo(i * CELL + 0.5, 0)
      ctx.lineTo(i * CELL + 0.5, SIZE)
      ctx.moveTo(0, i * CELL + 0.5)
      ctx.lineTo(SIZE, i * CELL + 0.5)
    }
    ctx.stroke()

    const g = game.current
    if (!g) return
    if (g.food) {
      ctx.fillStyle = color('--color-accent', '#f59e0b')
      ctx.beginPath()
      ctx.arc(g.food.x * CELL + CELL / 2, g.food.y * CELL + CELL / 2, CELL / 2.6, 0, Math.PI * 2)
      ctx.fill()
    }
    g.snake.forEach((part, i) => {
      ctx.fillStyle = i === 0 ? color('--color-fg', '#f7f2ec') : color('--color-ember', '#c2410c')
      ctx.fillRect(part.x * CELL + 1, part.y * CELL + 1, CELL - 2, CELL - 2)
    })
  }, [])

  useEffect(draw, [draw])

  useEffect(() => {
    if (status !== 'playing') return

    const onKeyDown = (e) => {
      const move = MOVES[e.key.toLowerCase()]
      if (!move) return
      e.preventDefault() // arrow keys steer instead of scrolling
      const { dir } = game.current
      // No turning straight back into yourself.
      if (move[0] !== -dir.x || move[1] !== -dir.y) game.current.next = { x: move[0], y: move[1] }
    }

    const timer = setInterval(() => {
      const g = game.current
      g.dir = g.next
      const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y }
      const offBoard = head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID
      if (offBoard || g.snake.some((part) => part.x === head.x && part.y === head.y)) {
        setStatus('over')
        return
      }
      g.snake.unshift(head)
      if (head.x === g.food.x && head.y === g.food.y) {
        g.score += 1
        setScore(g.score)
        g.food = placeFood(g.snake)
        if (!g.food) setStatus('over') // filled the board: nowhere left to go
      } else {
        g.snake.pop()
      }
      draw()
    }, TICK_MS)

    window.addEventListener('keydown', onKeyDown)
    return () => {
      clearInterval(timer)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [status, draw])

  const start = () => {
    const snake = [
      { x: 8, y: 8 },
      { x: 7, y: 8 },
      { x: 6, y: 8 },
    ]
    game.current = { snake, dir: { x: 1, y: 0 }, next: { x: 1, y: 0 }, food: placeFood(snake), score: 0 }
    setScore(0)
    setStatus('playing')
    draw()
  }

  return (
    <figure className={`rounded-xl border border-line bg-card p-4 shadow-2xl shadow-black/40 ${className}`}>
      <div className="mb-3 flex justify-between font-mono text-xs text-muted">
        <span>{'// snake.exe: just for fun'}</span>
        <span>
          score: <b className="text-accent">{score}</b>
        </span>
      </div>
      <canvas
        ref={canvas}
        width={SIZE}
        height={SIZE}
        aria-label="Snake game board"
        className="block aspect-square w-full rounded-lg border border-line"
      />
      <figcaption className="mt-3 flex items-center justify-between gap-3 font-mono text-xs text-muted">
        <span aria-live="polite">{status === 'over' ? `game over · score ${score}` : 'arrow keys / WASD'}</span>
        <button
          type="button"
          onClick={start}
          className="cursor-pointer rounded-md border border-accent px-3 py-1.5 text-accent transition-colors hover:bg-accent-soft"
        >
          {status === 'idle' ? 'start game' : status === 'over' ? 'play again' : 'restart'}
        </button>
      </figcaption>
    </figure>
  )
}
