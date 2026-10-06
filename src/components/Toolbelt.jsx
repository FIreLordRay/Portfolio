import { TOOLBELT } from '../data/site.js'
import SectionHeading from './SectionHeading.jsx'

/** The tools I build with, as a row of keycaps (hover one and it sinks). */
export default function Toolbelt() {
  return (
    <section id="toolbelt" aria-labelledby="toolbelt-heading" className="py-20">
      <SectionHeading id="toolbelt-heading" path="toolbelt">
        What I reach for when I build.
      </SectionHeading>
      <ul className="flex flex-wrap gap-4">
        {TOOLBELT.map((tool) => (
          <li
            key={tool}
            className="keycap keycap-hover bg-card font-mono text-sm text-fg [--k:3.1rem] [--pad-x:1rem] [--pad-y:0.4rem]"
          >
            <span>{tool}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
