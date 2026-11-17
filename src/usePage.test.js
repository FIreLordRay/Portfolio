import { describe, expect, it } from 'vitest'
import { FILES, MENU } from './data/site.js'
import { pageFor } from './usePage.js'

describe('pageFor', () => {
  it('opens the first tab when there is no hash', () => {
    expect(pageFor('')).toBe(FILES[0].id)
  })

  it('opens the tab a hash names', () => {
    for (const file of FILES) expect(pageFor(`#${file.id}`)).toBe(file.id)
  })

  it('opens the projects page for a project', () => {
    expect(pageFor('#embertype', 'about')).toBe('projects')
  })

  it('stays put for a hash that is not a page', () => {
    expect(pageFor('#main', 'contact')).toBe('contact')
  })

  it('has a page for every in-page link in the header menu', () => {
    const hrefs = MENU.flatMap((item) => [item.href, item.cta?.href, ...(item.columns ?? []).flatMap((c) => c.links.map((l) => l.href))])
    for (const href of hrefs.filter((h) => h?.startsWith('#'))) expect(pageFor(href, 'nowhere'), href).not.toBe('nowhere')
  })
})
