/** How many of the newest commits the background shows. */
export const MAX_COMMITS = 60

const MAX_MESSAGE = 72

/**
 * Boils one commit from GitHub's list-commits response down to what the background shows: its short
 * hash, repo, the first line of its message, when it was made, and a link. Returns null for anything
 * that is missing the basics, so a malformed item is skipped instead of breaking the run.
 */
export function trimCommit(repo, item) {
  const sha = item?.sha
  const message = item?.commit?.message
  const date = item?.commit?.author?.date ?? item?.commit?.committer?.date
  if (typeof sha !== 'string' || typeof message !== 'string' || !date || Number.isNaN(Date.parse(date))) return null

  const firstLine = message.split('\n')[0].trim()
  return {
    sha: sha.slice(0, 7),
    repo,
    message: firstLine.length > MAX_MESSAGE ? `${firstLine.slice(0, MAX_MESSAGE - 3)}...` : firstLine,
    date,
    url: item.html_url ?? null,
  }
}

/**
 * Merges the commits of several repos into one list, newest first, keeping only the newest `max`.
 *
 * @param {Record<string, object[]>} byRepo repo name to its raw commits
 */
export function trimCommits(byRepo, max = MAX_COMMITS) {
  return Object.entries(byRepo)
    .flatMap(([repo, items]) => (Array.isArray(items) ? items : []).map((item) => trimCommit(repo, item)))
    .filter(Boolean)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, max)
}
