import SectionHeading from './SectionHeading.jsx'

/**
 * A page of words about me, in a card like About's: a heading, a few paragraphs, and a list of
 * points. Used for business.md and leadership.md.
 *
 * @param {{ id: string, story: { heading: string, paragraphs: string[], points: string[] } }} props
 */
export default function Story({ id, story }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="py-20">
      <SectionHeading id={`${id}-heading`} path={id}>
        {story.heading}
      </SectionHeading>
      <div className="max-w-3xl space-y-4 rounded-2xl border border-line bg-card/60 p-6 text-lg leading-relaxed text-muted sm:p-8">
        {story.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <ul className="space-y-3 pt-2">
          {story.points.map((point) => (
            <li key={point} className="flex gap-3">
              <span aria-hidden="true" className="text-accent">
                ▸
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
