/** A section's title, with a small terminal-style path above it: "~/projects". */
export default function SectionHeading({ id, path, children }) {
  return (
    <div className="mb-10">
      <p className="font-mono text-sm text-accent">~/{path}</p>
      <h2 id={id} className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {children}
      </h2>
    </div>
  )
}
