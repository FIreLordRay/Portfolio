import { Mail } from 'lucide-react'
import { SITE } from '../data/site.js'
import GitHubIcon from './GitHubIcon.jsx'

/** The sign-off: an ember-lit card with my email and GitHub. */
export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-card px-6 py-16 text-center sm:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/2 h-64 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-ember/25 blur-3xl"
        />
        <div className="relative">
          {/* The logo has its own dark, rounded tile: framed like an app icon on the card. */}
          <img
            src={`${import.meta.env.BASE_URL}favicon.svg`}
            alt=""
            className="mx-auto size-16 rounded-md shadow-lg ring-1 shadow-black/50 ring-line"
          />
          <h2 id="contact-heading" className="mt-6 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Want to build something <span className="text-accent">together</span>?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted">I&apos;m always up for the next real project.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${SITE.email}`}
              className="keycap inline-flex items-center gap-2 bg-accent font-semibold text-bg [--k:3rem] [--pad-x:1.1rem] [--pad-y:0.3rem]"
            >
              <Mail size={18} aria-hidden="true" />
              <span>{SITE.email}</span>
            </a>
            <a
              href={SITE.github}
              className="keycap inline-flex items-center gap-2 bg-card font-semibold text-fg [--k:3rem] [--pad-x:1.1rem] [--pad-y:0.3rem]"
            >
              <GitHubIcon className="size-5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
