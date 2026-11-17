import { useEffect, useState } from 'react'
import { FILES, PROJECTS } from './data/site.js'

const PAGE_IDS = FILES.map((file) => file.id)
const PROJECT_IDS = new Set(PROJECTS.map((project) => project.id))

/**
 * Which tab's page a link like "#about" or "#embertype" opens. A project lives on the projects page.
 * Any other hash (the skip link's "#main", say) is not a page, so the current one stays open.
 */
export function pageFor(hash, current = PAGE_IDS[0]) {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  if (PAGE_IDS.includes(id)) return id
  if (PROJECT_IDS.has(id)) return 'projects'
  return current
}

/**
 * Each tab is its own page, chosen by the address's #hash, so links, the back button and shared
 * links all work on GitHub Pages without a server. Opening a page starts at its top, unless the link
 * named something on it (a project), which is scrolled into view instead.
 */
export default function usePage() {
  const [page, setPage] = useState(() => pageFor(window.location.hash))

  useEffect(() => {
    const onHashChange = () => setPage((current) => pageFor(window.location.hash, current))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    const id = window.location.hash.slice(1)
    const target = PROJECT_IDS.has(id) ? document.getElementById(id) : null
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [page])

  return page
}
