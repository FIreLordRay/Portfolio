import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { MENU, SITE } from '../data/site.js'
import ThemeToggle from './ThemeToggle.jsx'

const externalProps = (link) => (link.external ? { target: '_blank', rel: 'noreferrer' } : {})

const TRIGGER =
  'flex items-center gap-1.5 rounded-md px-3 py-2 text-muted transition-colors hover:text-fg aria-expanded:text-fg'

/**
 * The site's header, which stays on top: my name, a menu (Projects and Live demos open dropdown panels,
 * About and Contact are plain links), and the theme toggle. On small screens the menu folds into one
 * button. A dropdown closes on Escape (focus goes back to its button), on a click outside, when focus
 * moves away, and when you pick a link.
 */
export default function SiteHeader() {
  const [openId, setOpenId] = useState(null) // the desktop dropdown that is open, if any
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef(null)

  const closeAll = useCallback(() => {
    setOpenId(null)
    setMobileOpen(false)
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      const opener = headerRef.current?.querySelector('[aria-expanded="true"]')
      if (!opener) return
      closeAll()
      opener.focus() // back to the button that opened it, so keyboard users keep their place
    }
    const onPointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) closeAll()
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [closeAll])

  return (
    <header
      ref={headerRef}
      // Tabbing out of the header closes whatever is open. A click on empty space has no next target, so it is left to the pointer handler.
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) closeAll()
      }}
      className="sticky top-0 z-30 border-b border-line bg-panel font-mono text-sm text-muted"
    >
      <div className="flex h-[var(--header-h)] items-center gap-6 px-4 sm:px-6">
        <a href="#top" onClick={closeAll} className="flex items-center gap-3 font-bold text-fg">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="size-8 rounded-md" />
          {SITE.fullName}
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {MENU.map((item) =>
              item.columns ? (
                <li key={item.id}>
                  <button
                    type="button"
                    className={TRIGGER}
                    aria-expanded={openId === item.id}
                    aria-controls={`menu-${item.id}`}
                    onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  >
                    {item.label}
                    <ChevronDown size={14} aria-hidden="true" className={`transition-transform ${openId === item.id ? 'rotate-180' : ''}`} />
                  </button>
                  <div
                    id={`menu-${item.id}`}
                    role="group"
                    aria-label={item.label}
                    hidden={openId !== item.id}
                    className="absolute inset-x-0 top-full border-b border-line bg-panel shadow-2xl shadow-black/40"
                  >
                    <div className="mx-auto flex max-w-6xl gap-12 px-6 py-8">
                      <div className="w-72 shrink-0">
                        <p className="text-xs tracking-[0.14em] text-accent uppercase">{item.eyebrow}</p>
                        <p className="mt-2 text-fg">{item.blurb}</p>
                        <a href={item.cta.href} onClick={closeAll} {...externalProps(item.cta)} className="mt-4 inline-block text-accent underline underline-offset-4 hover:text-fg">
                          {item.cta.label}
                        </a>
                      </div>
                      <div className="grid flex-1 grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-8">
                        {item.columns.map((column) => (
                          <section key={column.title} aria-labelledby={`menu-${item.id}-${column.title}`}>
                            <h3 id={`menu-${item.id}-${column.title}`} className="text-xs tracking-[0.14em] text-muted uppercase">
                              {column.title}
                            </h3>
                            <ul className="mt-3 space-y-2">
                              {column.links.map((link) => (
                                <li key={link.href + link.label}>
                                  <a href={link.href} onClick={closeAll} {...externalProps(link)} className="text-fg transition-colors hover:text-accent">
                                    {link.label}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </section>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              ) : (
                <li key={item.id}>
                  <a href={item.href} onClick={closeAll} className="block rounded-md px-3 py-2 text-muted transition-colors hover:text-fg">
                    {item.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label="Menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-card hover:text-fg lg:hidden"
          >
            {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!mobileOpen}
        className="absolute inset-x-0 top-full max-h-[calc(100vh-var(--header-h))] overflow-y-auto border-b border-line bg-panel px-5 py-5 shadow-2xl shadow-black/40 lg:hidden"
      >
        <ul className="space-y-5">
          {MENU.map((item) =>
            item.columns ? (
              <li key={item.id}>
                <p className="text-xs tracking-[0.14em] text-accent uppercase">{item.label}</p>
                <ul className="mt-2 space-y-2">
                  {item.columns.flatMap((column) => column.links).map((link) => (
                    <li key={link.href + link.label}>
                      <a href={link.href} onClick={closeAll} {...externalProps(link)} className="block text-fg">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={item.id}>
                <a href={item.href} onClick={closeAll} className="block text-fg">
                  {item.label}
                </a>
              </li>
            ),
          )}
        </ul>
      </div>
    </header>
  )
}
