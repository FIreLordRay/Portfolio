import { SITE } from '../data/site.js'

const YEAR = new Date().getFullYear()

/** Copyright, plus credit where it's due: Brayden asks that his site be used as inspiration, with credit. */
export default function Footer() {
  return (
    <footer className="flex flex-col gap-2 border-t border-line py-10 text-sm text-muted sm:flex-row sm:justify-between">
      <p>
        © {YEAR} {SITE.fullName}
      </p>
      <p>
        Layout inspired by{' '}
        <a href="https://braydentw.io" className="text-fg underline decoration-line underline-offset-4 hover:decoration-accent">
          braydentw.io
        </a>{' '}
        by Brayden W. Editor look after{' '}
        <a
          href="https://github.com/alexdeploy/developer-portfolio-v2"
          className="text-fg underline decoration-line underline-offset-4 hover:decoration-accent"
        >
          Developer Portfolio V2
        </a>
        . Keycaps after{' '}
        <a href="https://uiverse.io" className="text-fg underline decoration-line underline-offset-4 hover:decoration-accent">
          20essentials on Uiverse
        </a>
        .
      </p>
    </footer>
  )
}
