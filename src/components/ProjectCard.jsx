import { ArrowRight } from 'lucide-react'
import GitHubIcon from './GitHubIcon.jsx'

/**
 * A project without a screenshot: name, what it is, a status badge if it's still going,
 * what it's built with, and a link to the code.
 *
 * @param {{ project: import('../data/site.js').Project }} props
 */
export default function ProjectCard({ project }) {
  const { name, pitch, status, description, tags = [], code } = project
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-card/60 p-6 transition-colors hover:border-accent/50">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-bold tracking-tight">{name}</h3>
        {status && (
          <span className="shrink-0 rounded-md bg-accent-soft px-2 py-1 font-mono text-[0.7rem] tracking-wide text-accent uppercase">
            {status}
          </span>
        )}
      </div>
      {pitch && <p className="mt-1 text-fg/90">{pitch}</p>}
      <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>

      {tags.length > 0 && (
        <ul aria-label="Built with" className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag} className="rounded-md bg-accent-soft px-2 py-1 font-mono text-xs text-accent">
              {tag}
            </li>
          ))}
        </ul>
      )}

      {code && (
        <a href={code} className="mt-auto inline-flex items-center gap-2 pt-6 font-mono text-sm text-accent hover:underline">
          <GitHubIcon className="size-4" />
          View on GitHub
          <ArrowRight size={14} aria-hidden="true" />
        </a>
      )}
    </article>
  )
}
