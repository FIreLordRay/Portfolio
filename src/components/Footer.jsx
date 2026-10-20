import { SITE } from '../data/site.js'

const YEAR = new Date().getFullYear()

/** Just the copyright line. */
export default function Footer() {
  return (
    <footer className="border-t border-line py-10 text-sm text-muted">
      <p>
        © {YEAR} {SITE.fullName}
      </p>
    </footer>
  )
}
