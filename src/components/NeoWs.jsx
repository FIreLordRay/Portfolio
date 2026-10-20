import { useEffect, useState } from 'react'
import { TriangleAlert } from 'lucide-react'
import SectionHeading from './SectionHeading.jsx'

const DATA_URL = `${import.meta.env.BASE_URL}data/neows.json`
const nf = new Intl.NumberFormat('en-US')
const day = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })

/** "2026-10-21" as "Oct 21" (parsed as UTC, so it never slips a day with the visitor's time zone). */
const formatDay = (iso) => day.format(new Date(`${iso}T00:00:00Z`))

/**
 * This week's near-Earth asteroids, from NASA's NeoWs API. The data is fetched at build time
 * (scripts/fetch-neows.mjs) and refreshed daily by the deploy workflow, so no API key is ever
 * sent to the browser.
 */
export default function NeoWs() {
  const [state, setState] = useState({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    fetch(DATA_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`${response.status}`)
        return response.json()
      })
      .then((data) => {
        if (!Array.isArray(data.objects) || data.objects.length === 0) throw new Error('empty')
        setState({ status: 'ready', data })
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ status: 'error' })
      })
    return () => controller.abort()
  }, [])

  return (
    <section id="neows" aria-labelledby="neows-heading" className="py-20">
      <SectionHeading id="neows-heading" path="neows">
        What&apos;s passing Earth this week.
      </SectionHeading>
      {state.status === 'loading' && <p className="font-mono text-sm text-muted">loading asteroids...</p>}
      {state.status === 'error' && (
        <p className="font-mono text-sm text-muted">
          NASA&apos;s asteroid data is unavailable right now. It refreshes every day, so check back soon.
        </p>
      )}
      {state.status === 'ready' && <Feed data={state.data} />}
    </section>
  )
}

function Feed({ data }) {
  const { objects, total, hazardousTotal, startDate, endDate } = data
  const farthest = Math.max(...objects.map((o) => o.missMiles))
  const closest = objects[0]

  return (
    <>
      <p className="max-w-2xl text-muted">
        <span className="text-fg">{total}</span> near-Earth asteroids make a close approach between {formatDay(startDate)} and{' '}
        {formatDay(endDate)}, <span className="text-fg">{hazardousTotal}</span> of them flagged potentially hazardous. The closest, {closest.name}, passes at{' '}
        <span className="text-accent">{nf.format(closest.missMiles)} miles</span> ({closest.missAu} AU, where 1 AU is the distance from Earth to the Sun).
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full min-w-[44rem] text-left text-sm tabular-nums">
          <caption className="sr-only">The {objects.length} closest asteroid approaches this week, nearest first</caption>
          <thead className="border-b border-line font-mono text-xs text-muted">
            <tr>
              <th scope="col" className="px-3 py-3 font-normal">asteroid</th>
              <th scope="col" className="px-3 py-3 font-normal">date</th>
              <th scope="col" className="px-3 py-3 text-right font-normal">miles away</th>
              <th scope="col" className="px-3 py-3 text-right font-normal">AU</th>
              <th scope="col" className="w-28 px-3 py-3 font-normal">
                <span className="sr-only">distance compared with the others</span>
              </th>
              <th scope="col" className="px-3 py-3 text-right font-normal">size</th>
              <th scope="col" className="px-3 py-3 text-right font-normal">speed</th>
            </tr>
          </thead>
          <tbody>
            {objects.map((o) => (
              <tr key={o.id} className="border-b border-line/60 last:border-0">
                <th scope="row" className="px-3 py-3 font-medium whitespace-nowrap">
                  <span className="flex items-center gap-2">
                    {o.name}
                    {o.hazardous && (
                      <span title="Potentially hazardous: large enough and passing close enough that NASA tracks it closely">
                        <TriangleAlert size={14} className="text-ember" aria-label="potentially hazardous" />
                      </span>
                    )}
                  </span>
                </th>
                <td className="px-3 py-3 whitespace-nowrap text-muted">{formatDay(o.date)}</td>
                <td className="px-3 py-3 text-right whitespace-nowrap text-accent">{nf.format(o.missMiles)}</td>
                <td className="px-3 py-3 text-right whitespace-nowrap text-muted">{o.missAu.toFixed(3)}</td>
                <td className="px-3 py-3">
                  <span aria-hidden="true" className="block h-1.5 w-full rounded-full bg-line">
                    <span className="block h-full rounded-full bg-accent" style={{ width: `${Math.max(3, (o.missMiles / farthest) * 100)}%` }} />
                  </span>
                </td>
                <td className="px-3 py-3 text-right whitespace-nowrap">{nf.format(o.diameterMeters)} m</td>
                <td className="px-3 py-3 text-right whitespace-nowrap">{o.speedKps.toFixed(1)} km/s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 font-mono text-xs text-muted">
        AU = astronomical unit, about 93 million miles. Source: NASA NeoWs. Updated{' '}
        {new Date(data.generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.
      </p>
    </>
  )
}
