import { SITE } from '../data/site.js'
import GitHubIcon from './GitHubIcon.jsx'

/** The editor window's title bar: traffic lights, the window title, and GitHub. Stays on top. */
export default function TitleBar() {
  return (
    <header className="sticky top-0 z-30 flex h-10 items-center gap-4 border-b border-line bg-panel px-4 font-mono text-xs text-muted">
      <div aria-hidden="true" className="flex gap-2">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
      </div>
      <p className="flex-1 truncate text-center">RayMond · portfolio</p>
      <a href={SITE.github} aria-label={`${SITE.fullName} on GitHub`} className="flex rounded p-1 transition-colors hover:text-fg">
        <GitHubIcon className="size-4" />
      </a>
    </header>
  )
}
