import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { ABOUT, PROJECTS, SITE, TOOLBELT } from './site.js'

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
    expect(JSON.stringify({ SITE, ABOUT, PROJECTS, TOOLBELT })).not.toMatch(/—/)
  })
})
