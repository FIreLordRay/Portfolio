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
 * The snake is made of fire: every block is a looping Lottie flame (fire.json, from
 * LottieFiles), each a few frames apart so they flicker on their own, and embers cool off the
 * tail from gold to orange to deep red. Until the flame has loaded, or if it can't, the blocks
 * are plain squares and the embers burn on their own.
 */
const FLAME_COLORS = ['#fbbf24', '#f59e0b', '#c2410c']
const FIRE_FPS = 24 // the Lottie flame's own frame rate
const FIRE_PX = 160 // each flame frame is pictured this big, then cropped and scaled onto the board
const FIRE_CROP = 0.55 // keep the bottom of the flame, its body, and leave the loose tongues above
const BLOCK_W = CELL * 1.25 // a flame block is a little wider than its cell, so the body joins up
const BLOCK_H = CELL * 1.6 // and taller, licking up into the cell above
const HEAD_SCALE = 1.3 // the head burns bigger

/** Where the tail ends, in board pixels, and the way it points (away from the body). */
function tailEnd(snake) {
  const tail = snake[snake.length - 1]
  const before = snake[snake.length - 2] ?? tail
  const away = { x: tail.x - before.x, y: tail.y - before.y }
  return { x: (tail.x + 0.5 + away.x * 0.4) * CELL, y: (tail.y + 0.5 + away.y * 0.4) * CELL, away }
}

/** New embers just behind the tail, thrown back away from the body and up. With the Lottie flame on, fewer and smaller: sparks. */
function spawnFlames(flames, snake, sparks) {
  const end = tailEnd(snake)
  const count = sparks ? (Math.random() < 0.5 ? 1 : 0) : 2
  for (let i = 0; i < count; i++) {
    const life = 18 + Math.random() * 14
    flames.push({
      x: end.x + (Math.random() - 0.5) * CELL * 0.6,
      y: end.y + (Math.random() - 0.5) * CELL * 0.6 - (sparks ? CELL * 0.8 : 0),
      vx: end.away.x * 0.6 + (Math.random() - 0.5) * 0.5,
      vy: end.away.y * 0.6 - 0.3 - Math.random() * 0.4,
      size: CELL * (0.3 + Math.random() * 0.15) * (sparks ? 0.45 : 1),
      life,
      max: life,
    })
  }
}

/**
 * Loads the Lottie flame and plays it once, off screen, keeping a picture of every frame (cropped
 * to the flame's body) so the game can stamp them on the board without running the player.
 */
async function loadFireFrames() {
  const [{ default: lottie }, { default: animationData }] = await Promise.all([
    import('lottie-web/build/player/lottie_light_canvas'),
    import('../assets/fire.json'),
  ])
  const holder = document.createElement('div')
  holder.setAttribute('aria-hidden', 'true')
  holder.style.cssText = `position:fixed;left:-9999px;top:0;width:${FIRE_PX}px;height:${FIRE_PX}px`
  document.body.append(holder)
  try {
    const anim = lottie.loadAnimation({ container: holder, renderer: 'canvas', loop: false, autoplay: false, animationData })
    await new Promise((resolve) => anim.addEventListener('DOMLoaded', resolve))
    const source = holder.querySelector('canvas')
    const full = []
    // The box every frame's flame fits in: the animation leaves lots of empty space around it.
    const box = { left: source.width, right: 0, top: source.height, bottom: 0 }
    for (let f = 0; f < anim.totalFrames; f++) {
      anim.goToAndStop(f, true)
      const frame = document.createElement('canvas')
      frame.width = source.width
      frame.height = source.height
      const ctx = frame.getContext('2d')
      ctx.drawImage(source, 0, 0)
      const pixels = ctx.getImageData(0, 0, frame.width, frame.height).data
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] < 20) continue
        const x = ((i - 3) / 4) % frame.width
        const y = Math.floor((i - 3) / 4 / frame.width)
        box.left = Math.min(box.left, x)
        box.right = Math.max(box.right, x)
        box.top = Math.min(box.top, y)
        box.bottom = Math.max(box.bottom, y)
      }
      full.push(frame)
    }
    anim.destroy()

    const width = box.right - box.left + 1
    const height = Math.round((box.bottom - box.top + 1) * FIRE_CROP)
    return full.map((frame) => {
      const block = document.createElement('canvas')
      block.width = width
      block.height = height
      block.getContext('2d').drawImage(frame, box.left, box.bottom + 1 - height, width, height, 0, 0, width, height)
      return block
    })
  } finally {
    holder.remove()
  }
}

/** Moves every ember on by `k` frames: it drifts, rises, shrinks and burns down. Burnt-out ones go. */
function burnFlames(flames, k) {
  for (const f of flames) {
    f.x += f.vx * k
    f.y += f.vy * k
    f.vy -= 0.03 * k // heat rises
    f.life -= k
  }
  return flames.filter((f) => f.life > 0)
}

/**
 * snake.exe: a little game beside my name, just for fun. Arrow keys or WASD steer, and only
 * while a game is running, so the page scrolls normally the rest of the time.
 */
export default function Snake({ className = '' }) {
  const canvas = useRef(null)
  const game = useRef(null) // the snake, its heading and the food: changes every tick, so not state
  const flames = useRef([]) // the embers behind the tail: change every frame
  const fire = useRef(null) // the Lottie flame's frames, once loaded
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

    // The embers go under the snake, and glow: overlapping embers add up to brighter fire.
    ctx.globalCompositeOperation = 'lighter'
    for (const f of flames.current) {
      const left = f.life / f.max // 1 when new, 0 when burnt out
      const radius = f.size * (0.4 + 0.6 * left)
      ctx.globalAlpha = Math.min(1, left * 1.4) * 0.85
      ctx.fillStyle = FLAME_COLORS[left > 0.65 ? 0 : left > 0.35 ? 1 : 2]
      ctx.beginPath()
      ctx.arc(f.x, f.y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1

    const frames = fire.current
    if (!frames) {
      g.snake.forEach((part, i) => {
        ctx.fillStyle = i === 0 ? color('--color-fg', '#f7f2ec') : color('--color-ember', '#c2410c')
        ctx.fillRect(part.x * CELL + 1, part.y * CELL + 1, CELL - 2, CELL - 2)
      })
      return
    }

    // A flame per block, standing on the bottom of its cell. Tail first, so the head burns on top.
    const tick = Math.floor(performance.now() / (1000 / FIRE_FPS))
    for (let i = g.snake.length - 1; i >= 0; i--) {
      const part = g.snake[i]
      const scale = i === 0 ? HEAD_SCALE : 1
      const w = BLOCK_W * scale
      const h = BLOCK_H * scale
      const x = (part.x + 0.5) * CELL - w / 2
      const base = (part.y + 1.05) * CELL
      ctx.drawImage(frames[(tick + i * 5) % frames.length], x, base - h, w, h)
    }

    // The head's white-hot core, so you can tell which end is which.
    const head = g.snake[0]
    ctx.fillStyle = color('--color-fg', '#f7f2ec')
    ctx.beginPath()
    ctx.arc((head.x + 0.5) * CELL, (head.y + 0.62) * CELL, CELL * 0.2, 0, Math.PI * 2)
    ctx.fill()
  }, [])

  // Fetch the Lottie flame once the page is idle, and only where the game shows (it's hidden on
  // phones) and motion is welcome. If it fails, the embers carry on alone.
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 768px)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!wide || calm) return
    let cancelled = false
    const load = () =>
      loadFireFrames()
        .then((frames) => {
          if (!cancelled) fire.current = frames
        })
        .catch(() => {})
    const idle = 'requestIdleCallback' in window
    const handle = idle ? window.requestIdleCallback(load, { timeout: 3000 }) : setTimeout(load, 1500)
    return () => {
      cancelled = true
      if (idle) window.cancelIdleCallback(handle)
      else clearTimeout(handle)
    }
  }, [])

  // Paint every frame while a game runs, so the flame flickers smoothly between the snake's
  // steps, and after a game ends until the last embers burn out. With reduced motion, no flame.
  useEffect(() => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf
    let last = performance.now()
    const frame = (now) => {
      const k = Math.min((now - last) / (1000 / 60), 3) // frames passed, at 60fps; capped after a stall
      last = now
      if (status === 'playing' && !calm) spawnFlames(flames.current, game.current.snake, Boolean(fire.current))
      flames.current = burnFlames(flames.current, k)
      draw()
      if (status === 'playing' || flames.current.length) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [status, draw])

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
        g.over = true // the flame goes out; the last embers still burn down
        setStatus('over')
        return
      }
      g.snake.unshift(head)
      if (head.x === g.food.x && head.y === g.food.y) {
        g.score += 1
        setScore(g.score)
        g.food = placeFood(g.snake)
        if (!g.food) {
          g.over = true // filled the board: nowhere left to go
          setStatus('over')
        }
      } else {
        g.snake.pop()
      }
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
    flames.current = []
    setScore(0)
    setStatus('playing')
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
