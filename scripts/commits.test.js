import { describe, expect, it } from 'vitest'
import { MAX_COMMITS, trimCommit, trimCommits } from './commits.js'

const item = (sha, message, date, overrides = {}) => ({
  sha,
  html_url: `https://github.com/me/repo/commit/${sha}`,
  commit: { message, author: { date } },
  ...overrides,
})

describe('trimCommit', () => {
  it('keeps the short hash, repo, first line of the message, date and link', () => {
    const raw = item('a1b2c3d4e5f6a7b8', 'Add the NeoWs section\n\nA longer body that is not needed.', '2026-10-20T12:00:00Z')
    expect(trimCommit('Portfolio', raw)).toEqual({
      sha: 'a1b2c3d',
      repo: 'Portfolio',
      message: 'Add the NeoWs section',
      date: '2026-10-20T12:00:00Z',
      url: 'https://github.com/me/repo/commit/a1b2c3d4e5f6a7b8',
    })
  })

  it('shortens a very long first line', () => {
    const message = trimCommit('r', item('abcdef1', 'x'.repeat(200), '2026-10-20T12:00:00Z')).message
    expect(message).toHaveLength(72)
    expect(message.endsWith('...')).toBe(true)
  })

  it('falls back to the committer date when there is no author date', () => {
    const raw = { sha: 'abcdef1', commit: { message: 'm', committer: { date: '2026-10-19T00:00:00Z' } } }
    expect(trimCommit('r', raw)).toMatchObject({ date: '2026-10-19T00:00:00Z', url: null })
  })

  it('returns null for anything missing the basics', () => {
    expect(trimCommit('r', {})).toBeNull()
    expect(trimCommit('r', null)).toBeNull()
    expect(trimCommit('r', item('abcdef1', 'm', 'not a date'))).toBeNull()
    expect(trimCommit('r', item(undefined, 'm', '2026-10-20T12:00:00Z'))).toBeNull()
  })
})

describe('trimCommits', () => {
  it('merges the repos into one list, newest first', () => {
    const result = trimCommits({
      alpha: [item('aaaaaaa1', 'old', '2026-10-01T00:00:00Z'), item('aaaaaaa2', 'newest', '2026-10-20T00:00:00Z')],
      beta: [item('bbbbbbb1', 'middle', '2026-10-10T00:00:00Z')],
    })
    expect(result.map((c) => c.message)).toEqual(['newest', 'middle', 'old'])
    expect(result.map((c) => c.repo)).toEqual(['alpha', 'beta', 'alpha'])
  })

  it('keeps only the newest commits when there are too many', () => {
    const many = Array.from({ length: MAX_COMMITS + 10 }, (_, i) => item(`ccccccc${i}`, `c${i}`, new Date(2026, 9, 1, 0, i).toISOString()))
    const result = trimCommits({ big: many })
    expect(result).toHaveLength(MAX_COMMITS)
    expect(result[0].message).toBe(`c${MAX_COMMITS + 9}`)
  })

  it('skips malformed items and repos that did not come back as a list', () => {
    const result = trimCommits({ ok: [item('ddddddd1', 'fine', '2026-10-20T00:00:00Z'), {}], broken: null, empty: [] })
    expect(result.map((c) => c.message)).toEqual(['fine'])
  })
})
