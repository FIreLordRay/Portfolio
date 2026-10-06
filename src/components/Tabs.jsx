import { FILES } from '../data/site.js'

/**
 * The editor's open tabs along the top of the page (desktop only): one per section, and the
 * one you're reading is in front. Clicking a tab jumps to it.
 *
 * @param {{ active: string }} props the id of the section on screen
 */
export default function Tabs({ active }) {
  return (
    <nav aria-label="Open files" className="sticky top-10 z-20 hidden border-b border-line bg-panel font-mono text-xs lg:flex">
      {FILES.map((file) => (
        <a
          key={file.id}
          href={`#${file.id}`}
          aria-current={active === file.id ? 'true' : undefined}
          className={`border-r border-line px-5 py-3 whitespace-nowrap transition-colors ${
            active === file.id ? 'bg-bg text-fg shadow-[inset_0_2px_0_var(--color-accent)]' : 'text-muted hover:text-fg'
          }`}
        >
          {file.name}
        </a>
      ))}
    </nav>
  )
}
