import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { applyTheme, nextTheme, readTheme } from '../theme.js'

/** Switches between the dark and light palettes, and remembers the choice. The icon is the theme you are in now. */
export default function ThemeToggle() {
  const [theme, setTheme] = useState(readTheme)
  const light = theme === 'light'
  const Icon = light ? Sun : Moon

  return (
    <button
      type="button"
      aria-pressed={light}
      aria-label="Light theme"
      title={`Switch to ${light ? 'dark' : 'light'} theme`}
      onClick={() => setTheme(applyTheme(nextTheme(theme)))}
      className="flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-card hover:text-fg"
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  )
}
