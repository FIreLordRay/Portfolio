import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { ABOUT, FILES, MENU, PROJECTS, SITE, TOOLBELT } from './site.js'

const isHttps = (url) => {
  try {
    return new URL(url).protocol === 'https:'
  } catch {
    return false
  }
}

describe('site data', () => {
  it('links only to https addresses, and has a real-looking email', () => {
    const links = [SITE.github, SITE.url, ...PROJECTS.flatMap((p) => [p.live, p.code].filter(Boolean))]
    for (const link of links) expect(isHttps(link), link).toBe(true)
    expect(SITE.email).toMatch(/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i)
  })

  it('gives every project what its card shows', () => {
    for (const project of PROJECTS) {
      for (const field of ['id', 'name', 'description']) expect(project[field], `${project.id}.${field}`).toBeTruthy()
      if (project.tags) expect(project.tags.length, project.id).toBeGreaterThan(0)
    }
  })

  it('gives featured projects a screenshot that exists, alt text and highlights', () => {
    const featured = PROJECTS.filter((p) => p.image)
    expect(featured.length).toBeGreaterThan(0)
    for (const project of featured) {
      expect(project.imageAlt, project.id).toBeTruthy()
      expect(project.highlights?.length, project.id).toBeGreaterThan(0)
      expect(existsSync(new URL(`../../public/${project.image}`, import.meta.url)), project.image).toBe(true)
    }
  })

  it('has no duplicate projects or tools, and something to say about me', () => {
    expect(new Set(PROJECTS.map((p) => p.id)).size).toBe(PROJECTS.length)
    expect(new Set(TOOLBELT).size).toBe(TOOLBELT.length)
    expect(ABOUT.length).toBeGreaterThan(0)
  })

  it('keeps the copy free of em dashes', () => {
    expect(JSON.stringify({ SITE, ABOUT, PROJECTS, TOOLBELT, MENU })).not.toMatch(/—/)
  })

  describe('the header menu', () => {
    const links = MENU.flatMap((item) => [item, item.cta, ...(item.columns ?? []).flatMap((c) => c.links)]).filter((l) => l?.href)

    it('has a unique id and either a link or a dropdown for every item', () => {
      expect(new Set(MENU.map((i) => i.id)).size).toBe(MENU.length)
      for (const item of MENU) {
        expect(item.label, item.id).toBeTruthy()
        expect(Boolean(item.href) !== Boolean(item.columns), `${item.id} needs an href or columns, not both`).toBe(true)
        if (item.columns) {
          for (const field of ['eyebrow', 'blurb', 'cta']) expect(item[field], `${item.id}.${field}`).toBeTruthy()
          for (const column of item.columns) expect(column.links.length, `${item.id}/${column.title}`).toBeGreaterThan(0)
        }
      }
    })

    it('points every in-page link at a section or project that exists', () => {
      const ids = new Set([...FILES.map((f) => f.id), ...PROJECTS.map((p) => p.id)])
      for (const link of links.filter((l) => l.href.startsWith('#'))) expect(ids.has(link.href.slice(1)), link.href).toBe(true)
    })

    it('sends every other link to an https address, opened in a new tab', () => {
      for (const link of links.filter((l) => !l.href.startsWith('#'))) {
        expect(isHttps(link.href), link.href).toBe(true)
        expect(link.external, link.href).toBe(true)
      }
    })
  })
})
