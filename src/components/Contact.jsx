import { SITE } from '../data/site.js'
import SectionHeading from './SectionHeading.jsx'

/** contact.json: my email and GitHub, as a terminal session. */
export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-20">
      <SectionHeading id="contact-heading" path="contact">
        Want to build something <span className="text-accent">together</span>?
      </SectionHeading>
      <p className="-mt-6 mb-8 text-muted">I&apos;m always up for the next real project.</p>

      <div className="max-w-3xl overflow-hidden rounded-xl border border-line bg-panel font-mono text-sm shadow-2xl shadow-black/40">
        <div className="flex items-center gap-3 border-b border-line bg-card px-4 py-2.5 text-xs text-muted">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-line" />
            <span className="size-2.5 rounded-full bg-line" />
            <span className="size-2.5 rounded-full bg-line" />
          </span>
          bash: ~/contact
        </div>
        <div className="grid gap-2 p-5 sm:p-6">
          <p>
            <span className="text-accent">$</span> cat email.txt
          </p>
          <p>
            <span className="text-muted">→</span>{' '}
            <a href={`mailto:${SITE.email}`} className="border-b border-dashed border-accent text-accent hover:bg-accent-soft">
              {SITE.email}
            </a>
          </p>
          <p className="mt-2">
            <span className="text-accent">$</span> open github
          </p>
          <p>
            <span className="text-muted">→</span>{' '}
            <a href={SITE.github} className="border-b border-dashed border-accent text-accent hover:bg-accent-soft">
              RayMond on GitHub
            </a>
          </p>
          <p className="mt-2">
            <span className="text-accent">$</span>
            <span aria-hidden="true" className="ml-2 inline-block h-[1.1em] w-2 animate-blink bg-accent align-[-0.2em]" />
          </p>
        </div>
      </div>
    </section>
  )
}
