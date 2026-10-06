import { ArrowUpRight, Flame } from 'lucide-react'
import GitHubIcon from './GitHubIcon.jsx'

/**
 * The big card for a project with a screenshot: the image in a browser frame, then what it is, what's notable about it,
 * what it's built with, and links to try it and read the code.
 *
 * @param {{ project: import('../data/site.js').Project }} props
 */
export default function FeaturedProject({ project }) {
  const { name, year, pitch, description, highlights, tags, image, imageAlt, live, code } = project
  return (
    <article id={project.id} className="grid gap-8 rounded-2xl border border-line bg-card/60 p-5 sm:p-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
      <figure className="overflow-hidden rounded-xl border border-line bg-bg shadow-2xl shadow-black/50">
        <div aria-hidden="true" className="flex items-center gap-1.5 border-b border-line px-3 py-2.5">
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
          <span className="ml-3 truncate font-mono text-xs text-muted">{name}</span>
        </div>
        <img src={`${import.meta.env.BASE_URL}${image}`} alt={imageAlt} width={1280} height={800} loading="lazy" className="block w-full" />
      </figure>

      <div>
        <p className="font-mono text-xs text-accent">
          {year}
          {live && ' · live'}
        </p>
        <h3 className="mt-2 text-3xl font-bold tracking-tight">{name}</h3>
        <p className="mt-2 text-lg">{pitch}</p>
        <p className="mt-3 text-muted">{description}</p>

        <ul className="mt-6 space-y-2.5 text-sm">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2.5">
              <Flame size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
              {highlight}
            </li>
          ))}
        </ul>

        <ul aria-label="Built with" className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag} className="rounded-md bg-accent-soft px-2 py-1 font-mono text-xs text-accent">
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          {live && (
            <a href={live} className="keycap inline-flex items-center gap-2 bg-accent font-semibold text-bg [--k:2.8rem] [--pad-x:1rem] [--pad-y:0.25rem]">
              <span>Try it</span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          )}
          {code && (
            <a href={code} className="keycap inline-flex items-center gap-2 bg-card text-fg [--k:2.8rem] [--pad-x:1rem] [--pad-y:0.25rem]">
              <GitHubIcon className="size-4" />
              <span>Code</span>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
