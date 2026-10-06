/** A section's title, written like a markdown heading under a terminal-style path: "~/projects", "# Here's what I've built." */
export default function SectionHeading({ id, path, children }) {
  return (
    <div className="mb-10">
      <p className="font-mono text-sm text-accent">~/{path}</p>
      <h2 id={id} className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        <span aria-hidden="true" className="font-normal text-muted">
          #{' '}
        </span>
        {children}
      </h2>
    </div>
  )
}
