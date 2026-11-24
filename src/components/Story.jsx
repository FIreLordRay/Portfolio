import SectionHeading from './SectionHeading.jsx'

const Points = ({ points }) =>
  points?.length > 0 && (
    <ul className="space-y-3 pt-2">
      {points.map((point) => (
        <li key={point} className="flex gap-3">
          <span aria-hidden="true" className="text-accent">
            ▸
          </span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
  )

/**
 * A page of words about me, in a card like About's: a heading, a few paragraphs, a list of
 * points, then optional titled sections, each its own card. Used for the story pages
 * (business.md, leadership.md, technology.md, career.md, wellness.md).
 *
 * @param {{ id: string, story: { heading: string, paragraphs: string[], points: string[],
 *   sections?: { title: string, paragraphs?: string[], points?: string[] }[] } }} props
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
        <Points points={story.points} />
      </div>
      {story.sections?.map((section) => (
        <article key={section.title} className="mt-6 max-w-3xl space-y-4 rounded-2xl border border-line bg-card/60 p-6 text-lg leading-relaxed text-muted sm:p-8">
          <h3 className="font-mono text-xl font-semibold text-fg">## {section.title}</h3>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <Points points={section.points} />
        </article>
      ))}
    </section>
  )
}
