import { FILES, PROJECTS, SITE } from '../data/site.js'

/**
 * The editor's file explorer, which is the site's navigation: one "file" per section, with
 * the projects folder open. The file you're reading is lit. On small screens it folds into
 * a row of links under the title bar.
 *
 * @param {{ active: string }} props the id of the section on screen
 */
export default function Explorer({ active }) {
  return (
    <aside className="border-b border-line bg-panel py-3 font-mono text-sm lg:sticky lg:top-10 lg:h-[calc(100vh-2.5rem)] lg:overflow-y-auto lg:border-r lg:border-b-0 lg:py-5">
      <a href="#top" className="flex items-center gap-3 px-5 pb-3 lg:mb-4 lg:border-b lg:border-line lg:pb-5">
        <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="size-10 rounded-lg" />
        <span className="font-bold text-fg">{SITE.fullName}</span>
      </a>

      <p className="hidden px-5 pb-2 text-[0.7rem] tracking-[0.14em] text-muted lg:block">EXPLORER</p>
      <nav aria-label="Sections">
        <ul className="flex [scrollbar-width:none] overflow-x-auto px-3 lg:block lg:px-0">
          {FILES.map((file) => (
            <li key={file.id}>
              <a
                href={`#${file.id}`}
                aria-current={active === file.id ? 'true' : undefined}
                className={`flex items-center gap-2.5 border-b-2 px-3 py-2 whitespace-nowrap transition-colors lg:border-b-0 lg:border-l-2 lg:px-5 lg:py-1.5 ${
                  active === file.id
                    ? 'border-accent text-fg lg:bg-accent-soft'
                    : 'border-transparent text-muted hover:bg-card hover:text-fg'
                }`}
              >
                <span aria-hidden="true" className="hidden w-3 text-center text-accent lg:inline">
                  {file.id === 'projects' ? '▾' : '◆'}
                </span>
                {file.name}
              </a>
              {file.id === 'projects' && (
                <ul className="hidden lg:block">
                  {PROJECTS.map((project) => (
                    <li key={project.id}>
                      <a
                        href={`#${project.id}`}
                        className="flex items-center gap-2.5 py-1 pr-5 pl-12 text-xs text-muted transition-colors hover:bg-card hover:text-fg"
                      >
                        <span aria-hidden="true" className="text-ember">
                          •
                        </span>
                        {project.id}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
