import { SITE } from '../data/site.js'
import GitHubIcon from './GitHubIcon.jsx'

const LINKS = [
  { href: '#about', label: 'about' },
  { href: '#projects', label: 'projects' },
  { href: '#toolbelt', label: 'toolbelt' },
  { href: '#contact', label: 'contact' },
]

/** Logo and name on the left; section links and GitHub on the right (links from sm up). */
export default function Header() {
  return (
    <header id="top" className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-6 sm:px-8">
      <a href="#top" className="flex items-center gap-2.5 rounded-lg">
        <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="size-9" />
        <span className="text-lg font-bold tracking-tight">{SITE.fullName}</span>
      </a>
      <nav aria-label="Main">
        <ul className="flex items-center gap-1 text-sm">
          {LINKS.map(({ href, label }) => (
            <li key={href} className="hidden sm:block">
              <a href={href} className="rounded-lg px-3 py-2 font-mono text-muted transition-colors hover:text-fg">
                {label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={SITE.github}
              aria-label={`${SITE.fullName} on GitHub`}
              className="ml-1 flex rounded-lg p-2 text-muted transition-colors hover:text-fg"
            >
              <GitHubIcon className="size-5" />
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
