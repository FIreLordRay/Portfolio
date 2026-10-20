/**
 * Pulls this week's near-Earth asteroids from NASA's NeoWs feed and writes the trimmed result to
 * public/data/neows.json, for the page to read. Runs at build time, so the API key lives in the
 * NASA_API_KEY environment variable (a GitHub secret in CI) and never reaches the browser.
 *
 * It never fails the build: with no key, or if NASA is down, it logs why and carries on, and the
 * page shows an "unavailable" message instead.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { trimFeed, weekFrom } from './neows.js'

const OUT = new URL('../public/data/neows.json', import.meta.url)
const ATTEMPTS = 3

const key = process.env.NASA_API_KEY
if (!key) {
  console.warn('fetch-neows: NASA_API_KEY is not set, skipping.')
  process.exit(0)
}

const range = weekFrom()
const url = new URL('https://api.nasa.gov/neo/rest/v1/feed')
url.search = new URLSearchParams({ start_date: range.startDate, end_date: range.endDate, api_key: key })

for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(20_000) })
    if (!response.ok) throw new Error(`NASA answered ${response.status}`)
    const data = trimFeed(await response.json(), range)
    await mkdir(new URL('./', OUT), { recursive: true })
    await writeFile(OUT, `${JSON.stringify(data, null, 2)}\n`)
    console.log(`fetch-neows: ${data.total} asteroids ${range.startDate} to ${range.endDate}, kept the closest ${data.objects.length}.`)
    process.exit(0)
  } catch (error) {
    // Only error.message is logged, never the URL, so the key can't leak into a build log.
    console.warn(`fetch-neows: attempt ${attempt} of ${ATTEMPTS} failed: ${error.message}`)
    if (attempt < ATTEMPTS) await new Promise((resolve) => setTimeout(resolve, 2000 * attempt))
  }
}
console.warn('fetch-neows: giving up, the page will show its unavailable message.')
