/**
 * Pulls the newest public commits from my GitHub repos and writes the trimmed result to
 * public/data/commits.json, for the animated background to read. Runs at build time, like
 * fetch-neows.mjs. In CI the GITHUB_TOKEN the workflow already has lifts GitHub's rate limit; run
 * locally with no token it still works, within GitHub's limit for anonymous requests.
 *
 * It never fails the build: if GitHub can't be reached it logs why and carries on, and the
 * background simply shows no commits.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { trimCommits } from './commits.js'

const OUT = new URL('../public/data/commits.json', import.meta.url)
const OWNER = process.env.GITHUB_OWNER || 'FIreLordRay'
const TOKEN = process.env.GITHUB_TOKEN
const MAX_REPOS = 12
const PER_REPO = 30

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-build' }
if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`

async function github(path) {
  const response = await fetch(`https://api.github.com${path}`, { headers, signal: AbortSignal.timeout(20_000) })
  // 409 is what GitHub says for a repo with no commits yet: nothing to show, not an error.
  if (response.status === 409) return []
  // Only the status is reported, never the request or the token.
  if (!response.ok) throw new Error(`GitHub answered ${response.status} for ${path.split('?')[0]}`)
  return response.json()
}

try {
  const repos = (await github(`/users/${OWNER}/repos?type=owner&sort=pushed&per_page=100`))
    .filter((repo) => !repo.fork && !repo.archived)
    .slice(0, MAX_REPOS)

  const byRepo = {}
  for (const repo of repos) {
    try {
      byRepo[repo.name] = await github(`/repos/${OWNER}/${repo.name}/commits?per_page=${PER_REPO}`)
    } catch (error) {
      console.warn(`fetch-commits: skipping ${repo.name}: ${error.message}`)
    }
  }

  const commits = trimCommits(byRepo)
  if (commits.length === 0) {
    console.warn('fetch-commits: no commits found, leaving the background without any.')
  } else {
    await mkdir(new URL('./', OUT), { recursive: true })
    await writeFile(OUT, `${JSON.stringify({ generatedAt: new Date().toISOString(), owner: OWNER, commits }, null, 2)}\n`)
    console.log(`fetch-commits: ${commits.length} commits from ${Object.keys(byRepo).length} repos.`)
  }
} catch (error) {
  console.warn(`fetch-commits: ${error.message}`)
}
