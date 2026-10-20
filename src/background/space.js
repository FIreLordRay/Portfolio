/**
 * The maths behind the animated background: building a moving body from a real asteroid or
 * commit, stepping it along, and finding the one under the pointer. No drawing happens here,
 * so all of it can be tested without a browser.
 */

const TAU = Math.PI * 2

/** A number from a string, so the same asteroid or commit always starts in the same place. */
export function hashString(text) {
  let hash = 2166136261
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/** A repeatable random-number function (mulberry32): call it for numbers from 0 up to 1. */
export function seededRandom(seed) {
  let a = typeof seed === 'string' ? hashString(seed) : seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Dot size in pixels for an asteroid's diameter. A log scale, since sizes run from a few metres to a kilometre. */
export function radiusFor(diameterMeters) {
  const low = Math.log10(5)
  const high = Math.log10(1000)
  const t = (Math.log10(Math.max(diameterMeters, 1)) - low) / (high - low)
  return 2 + 8 * Math.min(1, Math.max(0, t))
}

/**
 * A drifting, spinning rock for one asteroid: bigger asteroids draw bigger, faster ones drift faster.
 *
 * @param {{ id: string, name: string, hazardous: boolean, diameterMeters: number, speedKps: number }} asteroid
 */
export function makeAsteroid(asteroid, width, height) {
  const rand = seededRandom(String(asteroid.id))
  const angle = -0.35 + rand() * 0.7
  const speed = 4 + asteroid.speedKps * 0.45
  const direction = rand() < 0.5 ? 1 : -1
  return {
    kind: 'asteroid',
    hazardous: Boolean(asteroid.hazardous),
    r: radiusFor(asteroid.diameterMeters),
    x: rand() * width,
    y: rand() * height,
    vx: Math.cos(angle) * speed * direction,
    vy: Math.sin(angle) * speed,
    rot: rand() * TAU,
    spin: (rand() - 0.5) * 0.6,
    // A lumpy outline: nine points around the rock, each pushed in or out a little.
    outline: Array.from({ length: 9 }, (_, i) => ({ angle: (i / 9) * TAU, scale: 0.75 + rand() * 0.4 })),
  }
}

/**
 * A spark for one commit, drifting up and swaying like an ember.
 *
 * @param {{ sha: string, repo: string, message: string }} commit
 */
export function makeCommit(commit, width, height) {
  const rand = seededRandom(commit.sha)
  return {
    kind: 'commit',
    commit,
    r: 2 + rand() * 1.5,
    x: rand() * width,
    y: rand() * height,
    vx: (rand() - 0.5) * 3,
    vy: -(4 + rand() * 7),
    sway: 3 + rand() * 5,
    phase: rand() * TAU,
  }
}

/**
 * Moves a body forward by dt seconds. Anything that drifts off one edge comes back in on the opposite one.
 * `time` is the seconds since the start, which makes the commits sway.
 */
export function step(body, dt, width, height, time = 0) {
  const sway = body.kind === 'commit' ? Math.cos(time * 0.6 + body.phase) * body.sway * 0.6 : 0
  body.x += (body.vx + sway) * dt
  body.y += body.vy * dt
  if (body.spin) body.rot += body.spin * dt

  const margin = body.r + 20
  if (body.x > width + margin) body.x = -margin
  else if (body.x < -margin) body.x = width + margin
  if (body.y > height + margin) body.y = -margin
  else if (body.y < -margin) body.y = height + margin
}

/** The body closest to a point, if it is within maxDistance pixels, otherwise null. */
export function nearest(bodies, x, y, maxDistance) {
  let best = null
  let bestDistance = maxDistance
  for (const body of bodies) {
    const distance = Math.hypot(body.x - x, body.y - y)
    if (distance <= bestDistance) {
      best = body
      bestDistance = distance
    }
  }
  return best
}

/** Stand-in asteroids for when the real data is missing, so the background is never empty. */
export function fallbackAsteroids(count = 24) {
  const rand = seededRandom('fallback')
  return Array.from({ length: count }, (_, i) => ({
    id: `fallback-${i}`,
    name: `fallback-${i}`,
    hazardous: i % 8 === 0,
    diameterMeters: 10 ** (1 + rand() * 2),
    speedKps: 8 + rand() * 25,
  }))
}

/**
 * The solar system behind everything else. Planets run nearest the Sun first. `orbit` is how big the
 * planet's path is as a share of the outermost one, `period` is seconds for one lap, `phase` is where
 * on its path it starts, and `color` is "r,g,b". They are flat and muted on purpose, so they never
 * read as the glowing gold commits or the lumpy asteroids.
 */
export const PLANETS = [
  { name: 'Mercury', orbit: 0.09, r: 3, period: 28, phase: 0.6, color: '160,148,136' },
  { name: 'Venus', orbit: 0.15, r: 4.5, period: 46, phase: 2.1, color: '214,190,150' },
  { name: 'Earth', orbit: 0.22, r: 5, period: 72, phase: 4.0, color: '110,150,190', moon: true },
  { name: 'Mars', orbit: 0.29, r: 4, period: 110, phase: 1.2, color: '194,65,12' },
  { name: 'Jupiter', orbit: 0.42, r: 11, period: 190, phase: 5.0, color: '200,150,100' },
  { name: 'Saturn', orbit: 0.56, r: 9, period: 280, phase: 3.1, color: '220,200,160', ring: true },
  { name: 'Uranus', orbit: 0.72, r: 6.5, period: 400, phase: 0.2, color: '130,180,190' },
  { name: 'Neptune', orbit: 0.92, r: 6.2, period: 520, phase: 2.6, color: '90,120,180' },
]

/** Earth's Moon: its path around Earth in pixels, and seconds per lap. */
export const MOON = { orbit: 18, period: 11, r: 2 }

const TILT = -0.32 // radians: the whole system leans, as if seen from above at an angle
const SQUASH = 0.42 // every orbit is an ellipse this much as tall as it is wide

/** Where the Sun sits and how big the orbits are for a screen. The Sun is low and to the right, so most orbits sweep across the page. */
export function solarSystem(width, height) {
  return {
    x: width * 0.8,
    y: height * 0.78,
    reach: Math.max(width, height) * 0.95,
    sunRadius: Math.min(30, Math.max(14, Math.min(width, height) * 0.045)),
    tilt: TILT,
    squash: SQUASH,
  }
}

/** The half-width and half-height of a planet's elliptical path. */
export function orbitRadii(system, planet) {
  const a = planet.orbit * system.reach
  return { a, b: a * system.squash }
}

/**
 * Where a planet is at `time` seconds, and how near it is: depth runs from -1 (far side of the Sun)
 * to 1 (near side), and a planet on the near side is drawn a little bigger.
 */
export function planetState(system, planet, time) {
  const theta = planet.phase + (time / planet.period) * TAU
  const { a, b } = orbitRadii(system, planet)
  const [ex, ey] = [a * Math.cos(theta), b * Math.sin(theta)]
  const [cos, sin] = [Math.cos(system.tilt), Math.sin(system.tilt)]
  const depth = Math.sin(theta)
  return { x: system.x + ex * cos - ey * sin, y: system.y + ex * sin + ey * cos, depth, r: planet.r * (1 + 0.25 * depth) }
}

/** Where the Moon is, going round the given Earth position. */
export function moonState(earth, time) {
  const angle = (time / MOON.period) * TAU
  return { x: earth.x + Math.cos(angle) * MOON.orbit, y: earth.y + Math.sin(angle) * MOON.orbit * SQUASH }
}
