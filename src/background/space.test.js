import { describe, expect, it } from 'vitest'
import { MOON, PLANETS, fallbackAsteroids, makeAsteroid, makeCommit, moonState, nearest, orbitRadii, planetState, radiusFor, seededRandom, solarSystem, step } from './space.js'

const asteroid = { id: '3615557', name: '2012 UA174', hazardous: true, diameterMeters: 113, speedKps: 11.2 }
const commit = { sha: 'a1b2c3d', repo: 'Portfolio', message: 'Add the NeoWs section' }

describe('seededRandom', () => {
  it('gives the same numbers for the same seed, and different ones for another', () => {
    const [a, b, c] = [seededRandom('x'), seededRandom('x'), seededRandom('y')]
    const first = [a(), a(), a()]
    expect([b(), b(), b()]).toEqual(first)
    expect([c(), c(), c()]).not.toEqual(first)
  })

  it('stays between 0 and 1', () => {
    const rand = seededRandom('range')
    for (let i = 0; i < 500; i++) {
      const value = rand()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })
})

describe('radiusFor', () => {
  it('grows with size, and stays within 2 to 10 pixels however small or large', () => {
    expect(radiusFor(5)).toBeCloseTo(2)
    expect(radiusFor(1000)).toBeCloseTo(10)
    expect(radiusFor(1)).toBe(2)
    expect(radiusFor(1_000_000)).toBe(10)
    expect(radiusFor(500)).toBeGreaterThan(radiusFor(50))
  })
})

describe('makeAsteroid and makeCommit', () => {
  it('start in the same place every time for the same asteroid or commit', () => {
    expect(makeAsteroid(asteroid, 800, 600)).toEqual(makeAsteroid(asteroid, 800, 600))
    expect(makeCommit(commit, 800, 600)).toEqual(makeCommit(commit, 800, 600))
  })

  it('start inside the screen, and carry over what makes them different', () => {
    const rock = makeAsteroid(asteroid, 800, 600)
    expect(rock.x).toBeGreaterThanOrEqual(0)
    expect(rock.x).toBeLessThanOrEqual(800)
    expect(rock.hazardous).toBe(true)
    expect(rock.outline).toHaveLength(9)
    expect(makeCommit(commit, 800, 600).commit).toBe(commit)
  })

  it('make faster asteroids drift faster', () => {
    const slow = makeAsteroid({ ...asteroid, speedKps: 5 }, 800, 600)
    const fast = makeAsteroid({ ...asteroid, speedKps: 40 }, 800, 600)
    expect(Math.hypot(fast.vx, fast.vy)).toBeGreaterThan(Math.hypot(slow.vx, slow.vy))
  })

  it('send commits upward, like embers', () => {
    expect(makeCommit(commit, 800, 600).vy).toBeLessThan(0)
  })
})

describe('step', () => {
  it('moves a body by its velocity over the time passed', () => {
    const body = { kind: 'asteroid', r: 4, x: 100, y: 100, vx: 10, vy: -20, rot: 0, spin: 1 }
    step(body, 0.5, 800, 600)
    expect(body).toMatchObject({ x: 105, y: 90, rot: 0.5 })
  })

  it('brings a body back in on the opposite edge when it drifts out', () => {
    const right = { kind: 'asteroid', r: 4, x: 900, y: 100, vx: 10, vy: 0, rot: 0, spin: 0 }
    step(right, 0.1, 800, 600)
    expect(right.x).toBeLessThan(0)

    const top = { kind: 'commit', r: 3, x: 100, y: -100, vx: 0, vy: -10, sway: 0, phase: 0 }
    step(top, 0.1, 800, 600)
    expect(top.y).toBeGreaterThan(600)
  })
})

describe('nearest', () => {
  const bodies = [{ x: 10, y: 10, id: 'a' }, { x: 100, y: 100, id: 'b' }]

  it('finds the closest body within range', () => {
    expect(nearest(bodies, 95, 98, 20).id).toBe('b')
  })

  it('returns null when nothing is close enough', () => {
    expect(nearest(bodies, 300, 300, 20)).toBeNull()
    expect(nearest([], 0, 0, 20)).toBeNull()
  })
})

describe('fallbackAsteroids', () => {
  it('makes the same stand-ins every time, with a few hazardous ones', () => {
    const rocks = fallbackAsteroids(24)
    expect(rocks).toEqual(fallbackAsteroids(24))
    expect(rocks).toHaveLength(24)
    expect(rocks.some((r) => r.hazardous)).toBe(true)
  })
})

describe('the solar system', () => {
  const system = solarSystem(1280, 800)

  it('puts the Sun on screen and scales the orbits to it', () => {
    expect(system.x).toBeGreaterThan(0)
    expect(system.x).toBeLessThan(1280)
    expect(system.y).toBeLessThan(800)
    expect(system.sunRadius).toBeGreaterThanOrEqual(14)
    expect(system.sunRadius).toBeLessThanOrEqual(30)
    expect(solarSystem(2000, 1200).reach).toBeGreaterThan(system.reach)
  })

  it('keeps every planet on its own elliptical path', () => {
    for (const planet of PLANETS) {
      const { a, b } = orbitRadii(system, planet)
      for (const time of [0, 7, 31.5]) {
        const { x, y } = planetState(system, planet, time)
        const [dx, dy] = [x - system.x, y - system.y]
        const [cos, sin] = [Math.cos(system.tilt), Math.sin(system.tilt)]
        const along = dx * cos + dy * sin
        const across = -dx * sin + dy * cos
        expect((along / a) ** 2 + (across / b) ** 2).toBeCloseTo(1, 6)
      }
    }
  })

  it('brings a planet back to the same place after one lap', () => {
    for (const planet of PLANETS) {
      const start = planetState(system, planet, 3)
      const lap = planetState(system, planet, 3 + planet.period)
      expect(lap.x).toBeCloseTo(start.x, 6)
      expect(lap.y).toBeCloseTo(start.y, 6)
    }
  })

  it('draws a planet bigger on the near side of the Sun than the far side', () => {
    const earth = PLANETS.find((p) => p.name === 'Earth')
    const states = [0, 18, 36, 54].map((t) => planetState(system, earth, t))
    for (const s of states) {
      expect(s.depth).toBeGreaterThanOrEqual(-1)
      expect(s.depth).toBeLessThanOrEqual(1)
    }
    const [near, far] = [states.reduce((a, b) => (b.depth > a.depth ? b : a)), states.reduce((a, b) => (b.depth < a.depth ? b : a))]
    expect(near.r).toBeGreaterThan(far.r)
  })

  it('has inner planets that are closer in and faster, and keeps the Moon near Earth', () => {
    for (let i = 1; i < PLANETS.length; i++) {
      expect(PLANETS[i].orbit).toBeGreaterThan(PLANETS[i - 1].orbit)
      expect(PLANETS[i].period).toBeGreaterThan(PLANETS[i - 1].period)
    }
    const earth = planetState(system, PLANETS.find((p) => p.moon), 10)
    const moon = moonState(earth, 10)
    expect(Math.hypot(moon.x - earth.x, moon.y - earth.y)).toBeLessThanOrEqual(MOON.orbit)
  })
})
