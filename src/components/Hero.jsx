import { useEffect, useState } from 'react'
import { SITE } from '../data/site.js'
import HyperText from './HyperText.jsx'

/**
 * The keycaps floating around my name (desktop only). R, A and Y spell Ray; type them (or
 * any key shown) and that key presses, like on embertype's finger guide.
 * Positions are written out in full so Tailwind can see the classes.
 */
const KEYS = [
  { char: 'r', label: 'R', place: 'left-[7%] top-[10%]', size: 78, tilt: -10, accent: true, delay: 0 },
  { char: 'a', label: 'A', place: 'left-[15%] top-[46%]', size: 62, tilt: 7, delay: 1.3 },
  { char: 'y', label: 'Y', place: 'left-[6%] bottom-[12%]', size: 56, tilt: -5, delay: 2.4 },
  { char: '{', label: '{', place: 'right-[8%] top-[8%]', size: 66, tilt: 11, delay: 0.7 },
  { char: '/', label: '/', place: 'right-[16%] top-[44%]', size: 54, tilt: -8, delay: 1.9 },
  { char: '}', label: '}', place: 'right-[6%] bottom-[14%]', size: 72, tilt: 6, accent: true, delay: 2.9 },
]

/** The intro: my name (hover it), what I'm doing now, and where to go next. */
export default function Hero() {
  // The last key typed, and a counter so typing the same key again presses it again.
  const [press, setPress] = useState({ char: null, count: 0 })

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat || e.key.length !== 1) return
      setPress((last) => ({ char: e.key.toLowerCase(), count: last.count + 1 }))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <section aria-labelledby="hero-heading" className="relative mx-auto flex min-h-[80vh] max-w-6xl items-center px-5 py-16 sm:px-8">
      {/* A soft ember glow behind the name. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-72 max-w-2xl -translate-y-1/2 rounded-full bg-ember/20 blur-3xl"
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        {KEYS.map((key) => {
          const pressed = press.char === key.char
          return (
            <div
              key={key.char}
              className={`pointer-events-auto absolute animate-float ${key.place}`}
              style={{ rotate: `${key.tilt}deg`, animationDelay: `${key.delay}s` }}
            >
              <div
                // A new element for each press, so the press animation plays from the start.
                key={pressed ? `${key.char}-${press.count}` : key.char}
                className={`keycap keycap-hover grid place-items-center font-mono font-semibold ${
                  key.accent ? 'bg-accent text-bg' : 'bg-card text-fg'
                } ${pressed ? 'keycap-tap' : ''}`}
                style={{ '--k': `${key.size}px`, width: key.size, height: key.size, fontSize: key.size * 0.36 }}
              >
                <span>{key.label}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="font-mono text-sm text-muted">
          {SITE.tagline} <span className="text-accent">·</span> {SITE.program}
        </p>
        <h1
          id="hero-heading"
          aria-label={SITE.fullName} // a fixed name: screen readers never hear the hover scramble
          className="mt-5 text-5xl leading-[1.05] font-bold tracking-tight text-balance sm:text-7xl lg:text-8xl"
        >
          <HyperText text={SITE.fullName} />
        </h1>
        <p className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
          One <span className="text-accent">real project</span> at a <span className="text-accent">time</span>.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-lg text-pretty text-muted">
          Not a software engineer yet, working on it. I learn by shipping complete, real things people can use.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="#projects" className="keycap inline-flex bg-accent font-semibold text-bg [--k:3rem] [--pad-x:1.2rem] [--pad-y:0.3rem]">
            <span>View projects</span>
          </a>
          <a href="#contact" className="keycap inline-flex bg-card font-semibold text-fg [--k:3rem] [--pad-x:1.2rem] [--pad-y:0.3rem]">
            <span>Get in touch</span>
          </a>
        </div>
        <p className="mt-8 hidden font-mono text-xs text-muted/70 lg:block">psst: try typing r a y</p>
      </div>
    </section>
  )
}
