/**
 * Everything the site says, in one place. Shipping a new project means adding one entry to
 * PROJECTS: the page lays it out by itself. A project with a screenshot (`image`) gets the
 * big featured card; the rest share a grid.
 */

export const SITE = {
  name: 'Ray',
  fullName: 'RayMond Hall',
  tagline: 'Moving Towards Software Development',
  program: 'i.c.stars',
  email: 'rhall@icstars.org',
  github: 'https://github.com/FIreLordRay',
  url: 'https://firelordray.github.io/Portfolio/',
}

/** The page dressed as an editor: each section is a "file" in the explorer and the tabs, in page order. */
export const FILES = [
  { id: 'top', name: 'README.md' },
  { id: 'about', name: 'about.md' },
  { id: 'projects', name: 'projects/' },
  { id: 'neows', name: 'neows.json' },
  { id: 'toolbelt', name: 'toolbelt.json' },
  { id: 'contact', name: 'contact.json' },
]

/**
 * The header's menu. An item with `columns` opens a dropdown (a lead blurb with one link, then columns
 * of links); one with just an `href` is a plain link. A link's `href` is either "#id" for a part of this
 * page (checked by the tests) or an https address, marked `external` so it opens in a new tab.
 */
export const MENU = [
  {
    id: 'projects',
    label: 'Projects',
    eyebrow: 'What I build',
    blurb: 'One real project at a time, from a typing trainer to tools I use every day.',
    cta: { label: 'See all projects', href: '#projects' },
    columns: [
      {
        title: 'Featured',
        links: [
          { label: 'embertype', href: '#embertype' },
          { label: 'Cascade', href: '#cascade' },
        ],
      },
      {
        title: 'Python',
        links: [
          { label: 'Raybot', href: '#raybot' },
          { label: 'RayChat', href: '#raychat' },
          { label: 'Radial', href: '#radial' },
        ],
      },
      { title: 'Browser', links: [{ label: 'Tabster', href: '#tabster' }] },
    ],
  },
  {
    id: 'live',
    label: 'Live demos',
    eyebrow: 'Try it',
    blurb: 'Things you can open and use right now.',
    cta: { label: 'Open embertype', href: 'https://firelordray.github.io/embertype/', external: true },
    columns: [
      { title: 'Apps', links: [{ label: 'embertype', href: 'https://firelordray.github.io/embertype/', external: true }] },
      {
        title: 'On this page',
        links: [
          { label: 'NeoWs asteroid feed', href: '#neows' },
          { label: 'Snake', href: '#top' },
        ],
      },
    ],
  },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]

export const ABOUT = [
  'I got into coding because it connects so many things I already love: Legos, cars and, most of all, skateboarding. Building, figuring out how things work, and getting better one try at a time is something I already knew from all three.',
  "When I'm not at a keyboard, I'm outside. You'll usually find me at the lake or downtown. I love being outdoors.",
  "Right now I'm at i.c.stars (Cycle 60), moving towards a career in software development. My internship project is Cascade, built for Medline. So far I build things that solve my own problems, and I want to build on a larger scale, things that help a bigger audience. What keeps me going is wanting to know more, because the more I know, the more I'm able to do.",
  "If you're looking at my portfolio, I want you to know I'm not perfect, but I will do everything I can to get the best result.",
]

/**
 * @typedef {{ id: string, name: string, pitch?: string, status?: string, description: string,
 *             tags?: string[], highlights?: string[], year?: number, image?: string,
 *             imageAlt?: string, live?: string, code?: string }} Project
 * @type {Project[]} newest first
 */
export const PROJECTS = [
  {
    id: 'embertype',
    name: 'embertype',
    year: 2026,
    pitch: 'A typing trainer that teaches you to touch type.',
    description:
      'Monkeytype-style tests with live speed and accuracy, plus a touch-typing course. A 3D keyboard under the words lights the next key and the finger to use, and presses each key you type.',
    highlights: [
      'A 15-lesson course, home row first, with a 3D finger guide',
      'Progress dashboard: streaks, a daily goal, a per-key heatmap, personal bests',
      'Saved history that survives two open tabs, old versions and full storage',
      '171 unit tests, and every push is tested and deployed by GitHub Actions',
    ],
    tags: ['React', 'Tailwind CSS', 'Recharts', 'Vite', 'Vitest', 'GitHub Actions'],
    image: 'projects/embertype.png',
    imageAlt: 'The embertype typing screen: a line of words above a 3D keyboard, with the next key lit in amber.',
    live: 'https://firelordray.github.io/embertype/',
    code: 'https://github.com/FIreLordRay/embertype',
  },
  {
    id: 'cascade',
    name: 'Cascade',
    status: 'In progress',
    description:
      'My current internship project at i.c.stars (Cycle 60): a navigator built for Medline to track and surface operational incidents across branches, turning scattered problem reports into something a team can actually work from.',
  },
  {
    id: 'raybot',
    name: 'Raybot',
    pitch: 'Self-Growing Python Practice Bot',
    description:
      'A self-hosted Python learning platform with a Discord bot, a Flask web dashboard, and a tool-using AI chat agent, all sharing one SQLite curriculum. When learners run out of practice problems, a local LLM (via Ollama) generates new ones and has to prove its own solution passes its own tests before it\'s ever shown to anyone. Includes streaks, achievement badges, a leaderboard, an activity heatmap, live code grading, and an "Ask Raybot" tutor.',
    tags: ['Python', 'Discord.py', 'Flask', 'SQLite', 'Ollama'],
    code: 'https://github.com/FIreLordRay/raybot',
  },
  {
    id: 'raychat',
    name: 'RayChat',
    pitch: 'Local Tool-Calling AI Agent',
    description:
      "A local AI chat agent that runs entirely against Ollama on your own machine: no API key, nothing leaves the box. Instead of guessing at answers, it calls real tools: it executes Python code and reports the actual result, with every tool call and its raw output shown transparently in the chat transcript. The server is stateless, the tool loop is capped to avoid runaway calls, and it degrades gracefully with a clear status message if Ollama isn't running.",
    tags: ['Python', 'Flask', 'Ollama', 'Tool-Calling'],
    code: 'https://github.com/FIreLordRay/raybot',
  },
  {
    id: 'radial',
    name: 'Radial',
    pitch: 'Local-First Backlog Tool',
    description:
      "A local-first backlog tool that mirrors from, and pushes to, Plaky, themed to match Raybot's dashboard. Pulls every space, board, and item your Plaky API key can see into its own SQLite database on an interval, then lets you build a real backlog against a board's actual sections, with no invented status enum. Built with FastAPI, SQLite, and vanilla JS, no build step, no framework.",
    tags: ['Python', 'FastAPI', 'SQLite', 'Vanilla JS'],
    code: 'https://github.com/FIreLordRay/Radial',
  },
  {
    id: 'tabster',
    name: 'Tabster',
    pitch: 'Browser Tab Organizer',
    description:
      'A browser extension that automatically sorts open tabs into color-coded Chrome Tab Groups by domain and keyword, born out of my own habit of piling up dozens of tabs across unrelated contexts with no structure. A popup widget shows the live breakdown by category with one-click jump-to-tab and close-tab, and an options page lets categories and rules be added, renamed, or recolored without touching code. Runs entirely client-side: no network calls, no account, nothing leaves the browser.',
    tags: ['JavaScript', 'Chrome Extension', 'Manifest V3'],
    code: 'https://github.com/FIreLordRay/Tabster',
  },
]

/** What I reach for when I build: everything my projects above are made of. */
export const TOOLBELT = [
  'Python',
  'JavaScript',
  'React',
  'Tailwind CSS',
  'Flask',
  'FastAPI',
  'SQLite',
  'Discord.py',
  'Ollama',
  'Chrome Extensions',
  'Vite',
  'Vitest',
  'Git',
  'GitHub Actions',
]
