import { useEffect, useState } from 'react'

const BASE = import.meta.env.BASE_URL

/** One build-time data file, or null if it is missing or unreadable. The background just goes without. */
async function load(name) {
  try {
    const response = await fetch(`${BASE}data/${name}.json`)
    return response.ok ? await response.json() : null
  } catch {
    return null
  }
}

/**
 * The real asteroids (from NASA, via scripts/fetch-neows.mjs) and commits (from GitHub, via
 * scripts/fetch-commits.mjs) the background draws. Either list is empty if its file is missing.
 */
export default function useSpaceData() {
  const [data, setData] = useState({ asteroids: [], commits: [], ready: false })

  useEffect(() => {
    let current = true
    Promise.all([load('neows'), load('commits')]).then(([neows, commits]) => {
      if (!current) return
      setData({
        asteroids: Array.isArray(neows?.objects) ? neows.objects : [],
        commits: Array.isArray(commits?.commits) ? commits.commits : [],
        ready: true,
      })
    })
    return () => {
      current = false
    }
  }, [])

  return data
}
