import { ABOUT } from '../data/site.js'
import SectionHeading from './SectionHeading.jsx'

/** A few lines about me, in a card. */
export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <SectionHeading id="about-heading" path="about">
        About me.
      </SectionHeading>
      <div className="max-w-3xl space-y-4 rounded-2xl border border-line bg-card/60 p-6 text-lg leading-relaxed text-muted sm:p-8">
        {ABOUT.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  )
}
