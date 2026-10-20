/**
 * Dark is the site's own look; light is the alternative. The choice lives on the <html> element as
 * data-theme (CSS swaps the whole palette from it) and in localStorage, so it survives a reload.
 * A small script in index.html sets it before the page paints, so a saved light choice never flashes dark.
 */

export const THEME_KEY = 'theme'

/** The browser-chrome colour for each theme (the address bar on phones), matching each palette's background. */
export const THEME_COLORS = { dark: '#100c0a', light: '#fbf7f2' }

/** "light" or "dark": anything else, including nothing, is dark. */
export function readTheme(root = document.documentElement) {
  return root.dataset.theme === 'light' ? 'light' : 'dark'
}

export function nextTheme(theme) {
  return theme === 'light' ? 'dark' : 'light'
}

/**
 * Switches the page to a theme and remembers it. Storage can be blocked (private windows, strict
 * settings), so a failure to remember is ignored: the switch still happens, it just won't stick.
 */
export function applyTheme(
  theme,
  { root = document.documentElement, storage = globalThis.localStorage, meta = document.querySelector('meta[name="theme-color"]') } = {},
) {
  root.dataset.theme = theme
  meta?.setAttribute('content', THEME_COLORS[theme])
  try {
    storage.setItem(THEME_KEY, theme)
  } catch {
    // Not remembered; fine.
  }
  return theme
}
