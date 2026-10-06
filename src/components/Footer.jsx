import { SITE } from '../data/site.js'

const YEAR = new Date().getFullYear()

/** Copyright, plus credit where it's due: Brayden asks that his site be used as inspiration, with credit. */
export default function Footer() {
  return (
    <footer className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-line px-5 py-10 text-sm text-muted sm:flex-row sm:justify-between sm:px-8">
      <p>
        © {YEAR} {SITE.fullName}
      </p>
      <p>
        Layout inspired by{' '}
        <a href="https://braydentw.io" className="text-fg underline decoration-line underline-offset-4 hover:decoration-accent">
          braydentw.io
        </a>{' '}
        by Brayden W. Keycaps after{' '}
        <a href="https://uiverse.io" className="text-fg underline decoration-line underline-offset-4 hover:decoration-accent">
          20essentials on Uiverse
        </a>
        .
      </p>
    </footer>
  )
}
