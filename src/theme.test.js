import { describe, expect, it } from 'vitest'
import { THEME_COLORS, THEME_KEY, applyTheme, nextTheme, readTheme } from './theme.js'

const fakeRoot = (theme) => ({ dataset: theme ? { theme } : {} })
const fakeStorage = () => {
  const saved = {}
  return { saved, setItem: (key, value) => (saved[key] = value) }
}
const fakeMeta = () => {
  const attributes = {}
  return { attributes, setAttribute: (name, value) => (attributes[name] = value) }
}

describe('readTheme', () => {
  it('is light only when the page says light, and dark otherwise', () => {
    expect(readTheme(fakeRoot('light'))).toBe('light')
    expect(readTheme(fakeRoot('dark'))).toBe('dark')
    expect(readTheme(fakeRoot())).toBe('dark')
    expect(readTheme(fakeRoot('sepia'))).toBe('dark')
  })
})

describe('nextTheme', () => {
  it('flips between the two', () => {
    expect(nextTheme('dark')).toBe('light')
    expect(nextTheme('light')).toBe('dark')
  })
})

describe('applyTheme', () => {
  it('sets the page, the browser colour and the saved choice together', () => {
    const [root, storage, meta] = [fakeRoot(), fakeStorage(), fakeMeta()]
    expect(applyTheme('light', { root, storage, meta })).toBe('light')
    expect(root.dataset.theme).toBe('light')
    expect(meta.attributes.content).toBe(THEME_COLORS.light)
    expect(storage.saved[THEME_KEY]).toBe('light')
  })

  it('still switches when storage is blocked, and when there is no theme-color tag', () => {
    const root = fakeRoot()
    const blocked = {
      setItem: () => {
        throw new Error('blocked')
      },
    }
    expect(() => applyTheme('dark', { root, storage: blocked, meta: null })).not.toThrow()
    expect(root.dataset.theme).toBe('dark')
  })
})
