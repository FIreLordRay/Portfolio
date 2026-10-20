import { useEffect, useRef } from 'react'
import { MOON, PLANETS, fallbackAsteroids, makeAsteroid, makeCommit, moonState, nearest, orbitRadii, planetState, solarSystem, step } from './space.js'
import useSpaceData from './useSpaceData.js'

// Colours as "r,g,b", so each draw can pick its own opacity. Light mode uses deeper tones, and darkens the
// planets by `shade`, so everything still shows on cream.
const PALETTES = {
  dark: { accent: '245,158,11', gold: '251,191,36', muted: '160,148,136', shade: 1 },
  light: { accent: '168,76,8', gold: '217,119,6', muted: '107,93,82', shade: 0.55 },
}
// Few on purpose: enough to feel alive without pulling the eye from the page.
const MAX_ASTEROIDS = 14
const MAX_COMMITS = 24
const HOVER_RADIUS = 14

/**
 * A fixed canvas behind the page: a slowly turning solar system, this week's real asteroids drifting
 * and spinning through it (size and speed come from NASA's data, hazardous ones are amber) and my
 * recent commits rising like embers, each one showing its repo and message when the pointer is near.
 * It is decoration only, so it is hidden from screen readers, ignores the pointer, pauses when the tab is hidden, and holds still for anyone who
 * has asked their device to reduce motion.
 */
export default function SpaceBackground() {
  const data = useSpaceData()
  const canvasRef = useRef(null)
  const tipRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const tip = tipRef.current
    const ctx = canvas?.getContext('2d')
    if (!data.ready || !ctx) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0
    let height = 0
    let asteroids = []
    let commits = []
    let hovered = null
    let pal = PALETTES.dark
    let frame = 0
    let last = 0
    let time = 0

    const resize = () => {
      const [oldWidth, oldHeight] = [width, height]
      // The canvas's own size, not the window's: the window counts the scrollbar, the fixed canvas does not,
      // and a mismatch would stretch the drawing and throw the pointer off the dots.
      width = canvas.clientWidth
      height = canvas.clientHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      // Keep everything in the same place relative to the screen when it is resized.
      if (oldWidth) {
        for (const body of [...asteroids, ...commits]) {
          body.x *= width / oldWidth
          body.y *= height / oldHeight
        }
      }
      draw()
    }

    const drawAsteroid = (a) => {
      ctx.save()
      ctx.translate(a.x, a.y)
      ctx.rotate(a.rot)
      ctx.beginPath()
      a.outline.forEach((p, i) => {
        const [px, py] = [Math.cos(p.angle) * a.r * p.scale, Math.sin(p.angle) * a.r * p.scale]
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      })
      ctx.closePath()
      const color = a.hazardous ? pal.accent : pal.muted
      ctx.fillStyle = `rgba(${color},${a.hazardous ? 0.2 : 0.1})`
      ctx.strokeStyle = `rgba(${color},${a.hazardous ? 0.5 : 0.3})`
      ctx.lineWidth = 1
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    }

    const drawCommit = (c) => {
      const boost = c === hovered ? 2 : 1
      const flicker = 0.55 + 0.45 * Math.sin(time * 1.2 + c.phase)
      const glow = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r * 5 * boost)
      glow.addColorStop(0, `rgba(${pal.gold},${Math.min(1, 0.25 * flicker * boost)})`)
      glow.addColorStop(1, `rgba(${pal.gold},0)`)
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(c.x, c.y, c.r * 5 * boost, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = `rgba(${pal.gold},0.8)`
      ctx.beginPath()
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2)
      ctx.fill()
    }

    const drawPlanet = ({ planet, x, y, r, depth }) => {
      const alpha = 0.7 + 0.25 * depth
      if (planet.ring) {
        ctx.beginPath()
        ctx.ellipse(x, y, r * 2, r * 0.7, -0.3, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${shaded(planet.color)},${alpha * 0.8})`
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
      ctx.fillStyle = `rgba(${shaded(planet.color)},${alpha})`
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
      if (planet.moon) {
        const moon = moonState({ x, y }, time)
        ctx.fillStyle = `rgba(${pal.muted},0.8)`
        ctx.beginPath()
        ctx.arc(moon.x, moon.y, MOON.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // The orbits, then the Sun with the planets passing behind it (far side) and in front of it (near side).
    const drawSolarSystem = () => {
      const system = solarSystem(width, height)
      ctx.lineWidth = 1
      ctx.strokeStyle = `rgba(${pal.muted},0.09)`
      for (const planet of PLANETS) {
        const { a, b } = orbitRadii(system, planet)
        ctx.beginPath()
        ctx.ellipse(system.x, system.y, a, b, system.tilt, 0, Math.PI * 2)
        ctx.stroke()
      }

      const states = PLANETS.map((planet) => ({ planet, ...planetState(system, planet, time) }))
      states.filter((s) => s.depth < 0).forEach(drawPlanet)

      const glowRadius = system.sunRadius * 6
      const glow = ctx.createRadialGradient(system.x, system.y, 0, system.x, system.y, glowRadius)
      glow.addColorStop(0, `rgba(${pal.accent},0.3)`)
      glow.addColorStop(1, `rgba(${pal.accent},0)`)
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(system.x, system.y, glowRadius, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = `rgba(${pal.accent},0.8)`
      ctx.beginPath()
      ctx.arc(system.x, system.y, system.sunRadius, 0, Math.PI * 2)
      ctx.fill()

      states.filter((s) => s.depth >= 0).forEach(drawPlanet)
    }

    const shaded = (rgb) => (pal.shade === 1 ? rgb : rgb.split(',').map((v) => Math.round(v * pal.shade)).join(','))

    const draw = () => {
      pal = document.documentElement.dataset.theme === 'light' ? PALETTES.light : PALETTES.dark
      ctx.clearRect(0, 0, width, height)
      drawSolarSystem()
      asteroids.forEach(drawAsteroid)
      commits.forEach(drawCommit)
    }

    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      time += dt
      for (const body of [...asteroids, ...commits]) step(body, dt, width, height, time)
      draw()
      frame = requestAnimationFrame(loop)
    }

    const start = () => {
      if (frame || motion.matches || document.hidden) return
      last = performance.now()
      frame = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }

    const onVisibility = () => (document.hidden ? stop() : start())
    const onMotion = () => {
      if (motion.matches) {
        stop()
        draw()
      } else {
        start()
      }
    }

    const hideTip = () => {
      tip.style.opacity = '0'
      if (hovered) {
        hovered = null
        if (!frame) draw()
      }
    }
    const onMove = (event) => {
      const hit = nearest(commits, event.clientX, event.clientY, HOVER_RADIUS)
      if (!hit) return hideTip()
      if (hit !== hovered) {
        hovered = hit
        tip.textContent = `${hit.commit.repo} · ${hit.commit.sha}\n${hit.commit.message}`
        if (!frame) draw()
      }
      const left = Math.min(event.clientX + 16, width - tip.offsetWidth - 8)
      const top = Math.min(event.clientY + 16, height - tip.offsetHeight - 8)
      tip.style.transform = `translate(${Math.max(8, left)}px, ${Math.max(8, top)}px)`
      tip.style.opacity = '1'
    }
    const onLeave = (event) => {
      if (!event.relatedTarget) hideTip()
    }

    resize()
    const rocks = data.asteroids.length ? data.asteroids.slice(0, MAX_ASTEROIDS) : fallbackAsteroids(MAX_ASTEROIDS)
    asteroids = rocks.map((a) => makeAsteroid(a, width, height))
    commits = data.commits.slice(0, MAX_COMMITS).map((c) => makeCommit(c, width, height))
    draw()
    start()

    // A theme switch while still (reduced motion) needs one redraw; while animating, the next frame picks it up.
    const themeWatcher = new MutationObserver(() => {
      if (!frame) draw()
    })
    themeWatcher.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    motion.addEventListener('change', onMotion)
    return () => {
      stop()
      themeWatcher.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      motion.removeEventListener('change', onMotion)
    }
  }, [data])

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 size-full" />
      <div
        ref={tipRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-50 max-w-xs rounded-lg border border-line bg-bg px-3 py-2 font-mono text-xs whitespace-pre-line text-fg opacity-0 shadow-xl transition-opacity"
      />
    </>
  )
}
