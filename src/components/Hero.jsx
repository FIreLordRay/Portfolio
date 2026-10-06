import { useEffect, useState } from 'react'
import { SITE } from '../data/site.js'
import HyperText from './HyperText.jsx'
import Snake from './Snake.jsx'

/** R, A and Y spell Ray: type them and that key presses, like on embertype's finger guide (desktop only). */
const KEYS = [
  { char: 'r', label: 'R', tilt: -8, accent: true, delay: 0 },
  { char: 'a', label: 'A', tilt: 5, delay: 1.3 },
  { char: 'y', label: 'Y', tilt: -4, delay: 2.4 },
]

/** README.md: my name (hover it), what I'm doing now, where to go next, and a game of snake. */
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
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative grid items-center gap-12 py-16 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
    >
      {/* A soft ember glow behind the name. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-0 h-72 w-full max-w-xl -translate-y-1/2 rounded-full bg-ember/15 blur-3xl"
      />

      <div className="relative">
        <p className="font-mono text-sm text-accent">{'// hello, world'}</p>
        <h1
          id="hero-heading"
          aria-label={`Hi, I'm ${SITE.fullName}`} // a fixed name: screen readers never hear the hover scramble
          className="mt-4 text-5xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl xl:text-7xl"
        >
          Hi, I&apos;m{' '}
          <span className="text-accent">
            <HyperText text={SITE.fullName} />
          </span>
        </h1>
        <p className="mt-6 text-muted">
          <span className="text-accent">&gt; </span>
          {SITE.tagline} <span className="text-accent">·</span> {SITE.program}
          <span aria-hidden="true" className="ml-1 inline-block h-[1.1em] w-2 animate-blink bg-accent align-[-0.2em]" />
        </p>
        <p className="mt-6 text-xl font-semibold tracking-tight sm:text-2xl">
          One <span className="text-accent">real project</span> at a <span className="text-accent">time</span>.
        </p>
        <p className="mt-3 max-w-xl text-pretty text-muted">
          Not a software engineer yet, working on it. I learn by shipping complete, real things people can use.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a href="#projects" className="keycap inline-flex bg-accent font-semibold text-bg [--k:3rem] [--pad-x:1.2rem] [--pad-y:0.3rem]">
            <span>View projects →</span>
          </a>
          <a href="#contact" className="keycap inline-flex bg-card font-semibold text-fg [--k:3rem] [--pad-x:1.2rem] [--pad-y:0.3rem]">
            <span>Get in touch</span>
          </a>
        </div>

        <div aria-hidden="true" className="mt-10 hidden items-center gap-4 lg:flex">
          <span className="font-mono text-xs text-muted/70">psst: try typing</span>
          {KEYS.map((key) => {
            const pressed = press.char === key.char
            return (
              <div key={key.char} className="animate-float" style={{ rotate: `${key.tilt}deg`, animationDelay: `${key.delay}s` }}>
                <div
                  // A new element for each press, so the press animation plays from the start.
                  key={pressed ? `${key.char}-${press.count}` : key.char}
                  className={`keycap keycap-hover grid size-12 place-items-center font-semibold [--k:3rem] ${
                    key.accent ? 'bg-accent text-bg' : 'bg-card text-fg'
                  } ${pressed ? 'keycap-tap' : ''}`}
                >
                  <span>{key.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Snake className="relative hidden md:block lg:max-w-md lg:justify-self-end" />
    </section>
  )
}
