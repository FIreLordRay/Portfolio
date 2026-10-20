import { describe, expect, it } from 'vitest'
import { KEEP, trimAsteroid, trimFeed, weekFrom } from './neows.js'

// A tiny fake asteroid with only the fields trimAsteroid reads. NASA sends the distances and
// speeds as strings, so the fake does too.
const raw = {
  id: '99',
  name: '(2026 TA)',
  is_potentially_hazardous_asteroid: true,
  estimated_diameter: { meters: { estimated_diameter_min: 90, estimated_diameter_max: 110 } },
  close_approach_data: [
    {
      close_approach_date: '2026-10-22',
      miss_distance: { astronomical: '0.29638106', miles: '27550340.361912263' },
      relative_velocity: { kilometers_per_second: '15.4959422132' },
    },
  ],
}

describe('trimAsteroid', () => {
  it("turns NASA's strings into rounded numbers", () => {
    expect(trimAsteroid(raw)).toEqual({
      id: '99',
      name: '2026 TA',
      date: '2026-10-22',
      hazardous: true,
      diameterMeters: 100,
      missAu: 0.296,
      missMiles: 27550340,
      speedKps: 15.5,
    })
  })

  it('gives numbers back, not strings, so the page can sort them', () => {
    const { missAu, missMiles, speedKps } = trimAsteroid(raw)
    for (const value of [missAu, missMiles, speedKps]) expect(typeof value).toBe('number')
  })

  it('leaves a name without parentheses alone', () => {
    expect(trimAsteroid({ ...raw, name: '433 Eros' }).name).toBe('433 Eros')
  })

  it('keeps the parentheses inside a numbered name, as NASA sends it', () => {
    expect(trimAsteroid({ ...raw, name: '516803 (2010 JG88)' }).name).toBe('516803 (2010 JG88)')
  })
})

// A fake asteroid whose distance is the only thing that matters to the sort and the cut.
const at = (id, missMiles, overrides = {}) => ({
  ...raw,
  id,
  close_approach_data: [{ ...raw.close_approach_data[0], miss_distance: { astronomical: '0.1', miles: String(missMiles) } }],
  ...overrides,
})

const range = { startDate: '2026-10-20', endDate: '2026-10-26', now: new Date('2026-10-20T12:00:00Z') }

describe('trimFeed', () => {
  it('merges the days into one list, nearest first', () => {
    const feed = { near_earth_objects: { '2026-10-22': [at('far', 900), at('near', 100)], '2026-10-21': [at('mid', 500)] } }
    const result = trimFeed(feed, range)
    expect(result.objects.map((o) => o.id)).toEqual(['near', 'mid', 'far'])
    expect(result.generatedAt).toBe('2026-10-20T12:00:00.000Z')
  })

  it('keeps only the closest, but counts the whole week', () => {
    const many = Array.from({ length: KEEP + 5 }, (_, i) => at(`N${i}`, 1000 + i, { is_potentially_hazardous_asteroid: true }))
    const result = trimFeed({ near_earth_objects: { '2026-10-21': many } }, range)
    expect(result.objects).toHaveLength(KEEP)
    expect(result.total).toBe(KEEP + 5)
    expect(result.hazardousTotal).toBe(KEEP + 5)
  })

  it('skips an asteroid with missing data and keeps the rest', () => {
    const feed = { near_earth_objects: { '2026-10-21': [at('ok', 100), at('empty', 100, { close_approach_data: [] }), at('nan', 'oops')] } }
    expect(trimFeed(feed, range).objects.map((o) => o.id)).toEqual(['ok'])
  })

  it('copes with an empty or missing response', () => {
    expect(trimFeed({}, range).objects).toEqual([])
    expect(trimFeed(undefined, range).total).toBe(0)
  })
})

describe('weekFrom', () => {
  it('spans seven days inclusive, the most NASA allows in one request', () => {
    expect(weekFrom(new Date('2026-10-20T23:30:00Z'))).toEqual({ startDate: '2026-10-20', endDate: '2026-10-26' })
  })
})
