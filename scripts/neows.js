/**
 * Boils one raw NeoWs asteroid down to what the page shows. NASA sends every number as a
 * string, so each one is converted with Number() before it is rounded.
 */
export function trimAsteroid(asteroid) {
  // close_approach_data is a list. In the feed it holds the one approach on that day.
  const approach = asteroid.close_approach_data[0]
  const meters = asteroid.estimated_diameter.meters

  return {
    id: asteroid.id,
    // "(2026 TA)" becomes "2026 TA", but "516803 (2010 JG88)" is left whole: only parentheses around the entire name go.
    name: asteroid.name.replace(/^\((.*)\)$/, '$1'),
    date: approach.close_approach_date,
    hazardous: asteroid.is_potentially_hazardous_asteroid,
    diameterMeters: Math.round((meters.estimated_diameter_min + meters.estimated_diameter_max) / 2),
    missAu: Number(Number(approach.miss_distance.astronomical).toFixed(3)),
    missMiles: Math.round(Number(approach.miss_distance.miles)),
    speedKps: Number(Number(approach.relative_velocity.kilometers_per_second).toFixed(1)),
  }
}

/** How many of the closest approaches the page shows. A week has about a hundred. */
export const KEEP = 20

/**
 * Turns a whole NeoWs feed into what the page needs: the closest approaches, nearest first,
 * plus counts for the whole week.
 *
 * @param {{ near_earth_objects?: Record<string, object[]> }} feed
 * @param {{ startDate: string, endDate: string, now?: Date }} range
 */
export function trimFeed(feed, { startDate, endDate, now = new Date() }) {
  // The feed groups asteroids under a key per day. Object.values drops the keys, .flat() merges the days.
  const raw = Object.values(feed?.near_earth_objects ?? {}).flat()

  const all = []
  for (const asteroid of raw) {
    try {
      const trimmed = trimAsteroid(asteroid)
      // A missing field becomes NaN after Number(): skip the asteroid rather than draw it.
      if ([trimmed.diameterMeters, trimmed.missAu, trimmed.missMiles, trimmed.speedKps].every(Number.isFinite)) all.push(trimmed)
    } catch {
      // No approach or diameter data on this one: skip it, keep the rest.
    }
  }

  return {
    generatedAt: now.toISOString(),
    startDate,
    endDate,
    // Counted on the full list, before the cut to KEEP, so they describe the whole week.
    total: all.length,
    hazardousTotal: all.filter((a) => a.hazardous).length,
    objects: all.sort((a, b) => a.missMiles - b.missMiles).slice(0, KEEP),
  }
}

/** The feed's date window: today through six days on, which is the most NASA allows in one request. */
export function weekFrom(now = new Date()) {
  const day = (offset) => new Date(now.getTime() + offset * 86_400_000).toISOString().slice(0, 10)
  return { startDate: day(0), endDate: day(6) }
}
