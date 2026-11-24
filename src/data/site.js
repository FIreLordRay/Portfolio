/**
 * Everything the site says, in one place. Shipping a new project means adding one entry to
 * PROJECTS: the page lays it out by itself. A project with a screenshot (`image`) gets the
 * big featured card; the rest share a grid.
 */

export const SITE = {
  name: 'Ray',
  fullName: 'RayMond Hall',
  tagline: 'Tech sales, backed by someone who builds the software',
  program: 'i.c.stars',
  email: 'rhall@icstars.org',
  github: 'https://github.com/FIreLordRay',
  url: 'https://firelordray.github.io/Portfolio/',
}

/** The page dressed as an editor: each page is a "file" in the explorer, in order. */
export const FILES = [
  { id: 'top', name: 'README.md' },
  { id: 'about', name: 'about.md' },
  { id: 'business', name: 'business.md' },
  { id: 'leadership', name: 'leadership.md' },
  { id: 'technology', name: 'technology.md' },
  { id: 'career', name: 'career.md' },
  { id: 'wellness', name: 'wellness.md' },
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
          { label: 'Pulse', href: '#pulse' },
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
      {
        title: 'Apps',
        links: [
          { label: 'Pulse', href: 'https://firelordray.github.io/city-scorecard/', external: true },
          { label: 'Pulse Rent', href: 'https://firelordray.github.io/pulse-rent/', external: true },
          { label: 'embertype', href: 'https://firelordray.github.io/embertype/', external: true },
        ],
      },
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
  { id: 'business', label: 'Business', href: '#business' },
  { id: 'leadership', label: 'Leadership', href: '#leadership' },
  { id: 'technology', label: 'Technology', href: '#technology' },
  { id: 'career', label: 'Career', href: '#career' },
  { id: 'wellness', label: 'Wellness', href: '#wellness' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]

export const ABOUT = [
  'I got into coding because it connects so many things I already love: Legos, cars and, most of all, skateboarding. Building, figuring out how things work, and getting better one try at a time is something I already knew from all three.',
  "When I'm not at a keyboard, I'm outside. You'll usually find me at the lake or downtown. I love being outdoors.",
  "Right now I'm at i.c.stars (Cycle 60), moving towards a career in tech sales, backed by the software I build. My internship project is Cascade, built for Medline. Building my own projects means I understand technology from the inside, and I want to bring that to tech sales: knowing what a product really does and how it helps the people using it. So far I build things that solve my own problems, and I want to build on a larger scale, things that help a bigger audience. What keeps me going is wanting to know more, because the more I know, the more I'm able to do.",
  "If you're looking at my portfolio, I want you to know I'm not perfect, but I will do everything I can to get the best result.",
]

/**
 * The story pages (business.md, leadership.md, technology.md, career.md, wellness.md): the C60
 * Digital Portfolio sections. Each has a heading, an intro, a list of points, and optional titled
 * `sections` below them, all in my own words from my i.c.stars work.
 */

/** business.md: the sales side of me, and the consulting work at i.c.stars. */
export const BUSINESS = {
  heading: 'Where I come from: sales.',
  paragraphs: [
    'Before I wrote code, I sold. As a real estate broker I built my own pipeline: finding leads, following up and closing, with no one handing me clients. I also trained and onboarded new sales reps, teaching them how to talk to customers and how to keep a pipeline moving.',
    "That's why I'm heading into tech sales. I know the sales side, and now I know the build side too. When I talk about a product, I can explain what it actually does and how it helps the person using it, because I build products myself.",
  ],
  points: [
    'Building a pipeline and following up, from my own real estate business',
    'Training and onboarding new sales reps',
    'Explaining technical products in plain language',
    'Turning what a customer needs into something a team can build, as on Cascade for Medline',
  ],
  sections: [
    {
      title: 'Client project: Cascade for Medline',
      paragraphs: [
        "The problem: Medline's branches already log disruptions, like a handheld scanner going offline. What was missing is the step between \"this happened once\" and \"this keeps happening, and someone owns fixing it.\" That gap was the whole product.",
        'Our approach: we read the RFP together, wrote down only what it asked for, and planned the work in sprints. Cascade takes in incident reports, finds the patterns across them, turns a pattern into a Problem with an owner, and tracks it until it is actually resolved, not just closed.',
        'My role: Engineering and Technical Architecture Lead. I owned the path from design to a working MVP: the architecture, the database, the APIs, our Git and GitHub practices, and testing. In the proposal presentation I covered our tech stack.',
      ],
    },
    {
      title: 'My consulting company: All Stars Associates (A.S.A.)',
      paragraphs: [
        "Our five-person team became All Stars Associates. We split the work by role so everyone had clear ownership: a Project Manager, a Product and Business Analyst, a UX/UI lead, a Data and AI lead, and me on engineering. A role meant where you take the lead, not a silo.",
        'We wrote our own team agreement: all communication goes through Teams, every role is named, and work moves forward every day, no matter how small. My personal commitment was centralized communication, so everyone knows where to talk and when.',
      ],
    },
    {
      title: 'Answering the RFP',
      paragraphs: [
        'Our proposal had to show how the solution would be thought out, built, tested and handed off, sprint by sprint. We planned a run of show so every person owned a section with a time limit: an intro, my tech stack section, the UX persona and data set, the ERD, and a close. Planning who talks when is what keeps a presentation from turning into chaos.',
      ],
    },
    {
      title: 'What I learned about business communication',
      paragraphs: [
        'Lead with the decision. In our credibility-in-writing workshop, a client\'s requirements contradicted each other: one part needed a phone number, and their data policy did not allow storing one. My recommendation was to ask the client one written question that day instead of building two versions or waiting for a call, because a data policy decision should come from the policy owner in writing. Short, clear, and easy to answer gets a faster yes.',
      ],
    },
  ],
}

/** leadership.md: how I lead, with the places I've done it. */
export const LEADERSHIP = {
  heading: 'How I lead.',
  paragraphs: [
    "I'm the tech lead on Cascade, our i.c.stars internship project for Medline. I started it in October and have cared for it since. Mostly, I try to make it easy for the team to do good work.",
  ],
  points: [
    'Set up our repo and the tests that check every change before it goes in',
    "Merged my teammates' work and kept the project running",
    'Trained and onboarded new sales reps before I got into tech',
    'On the i.c.stars debate team',
  ],
  sections: [
    {
      title: 'My Dream Speech',
      paragraphs: [
        'In my Dream Speech I accepted the Turing Award in 2051 for Step In: AI that tells small farmers what each neighborhood needs, so families who live miles from fresh food can get it close to home, at a price they can afford.',
        'The line I keep: "If the idea is big, the work is gonna be bigger. And the work is worth it." I had the idea before I had the skills, so I had to teach myself to code to build what I believed in. One week I had 15 tasks due while I was still learning how to do all of them.',
      ],
    },
    {
      title: 'Team Week and my role on the team',
      paragraphs: [
        'My team would describe me as a go-getter: I am always trying to get a task or a project to move. I work best when there is a clear goal and everyone knows how to move with it. I was one of our two presenters, and later the engineering lead.',
        "What I'm most confident doing is letting the team collaborate and using that collaboration as fuel for the next step. My blind spot is being on time with my task list, and I'm a little hard on myself about it.",
      ],
    },
    {
      title: 'Giving and receiving feedback',
      paragraphs: [
        'In our Micro-360 I wrote down the words I heard most from my peers: too comfortable, zoned out, distracted, on my phone, misses deadlines. The pattern was clear. When I get comfortable, I zone out, and it comes across as not caring.',
        "My 10 percent shift: in every session I take written notes and ask or answer at least one question out loud. I tracked it for 10 days with a daily tally and a partner check-in. If people see me taking notes and speaking up, they'll trust me to be locked in when it counts.",
      ],
    },
    {
      title: 'Leading by doing: a contribution nobody asked for',
      paragraphs: [
        'I saw that our team kept losing track of where the project stood, so I planned a desktop widget that shows the status of the project and what is coming up next. Nobody asked for it. The goal was for A.S.A. to check it every day instead of asking around.',
      ],
    },
  ],
}

/** technology.md: what I built at i.c.stars, how, and what I learned. */
export const TECHNOLOGY = {
  heading: 'What I built, and how.',
  paragraphs: [
    'I learn by building real things and asking why they work. My rule: for anything new I add, I can explain it out loud in one sentence before I commit it. Copying code I don\'t understand just to finish faster is the habit I watch for.',
  ],
  points: [
    'Pulse: a responsive web app I built on my own, front end to data pipeline',
    'Cascade: tech lead for our five-person team, on GitHub with branches and reviews',
    'Every project has automated tests, and GitHub Actions checks every change before it ships',
    'Teams, Outlook and Plaky to run the work, and a tool I built (Radial) to manage our Plaky board',
  ],
  sections: [
    {
      title: 'Walkthrough: Pulse',
      paragraphs: [
        "The problem: Chicago publishes a lot of data about city services, but a resident can't easily tell how well the city is serving their neighborhood. Pulse turns 311 requests, census income, clinics, transit, housing and food inspections into a report card for all 77 community areas.",
        'How it works: type your address, and you get your neighborhood\'s grade, how long 311 requests wait compared with the rest of the city, your ward and alderman, the closest free clinics, and grocery stores that take SNAP. Its main finding is that the same 311 request takes about 13% longer to close in the poorest areas.',
        "What I built: all of it. The React front end, the scripts that pull and clean the city's data, the scoring, the maps, and the tests. It's live at firelordray.github.io/city-scorecard.",
      ],
    },
    {
      title: 'When it clicked, and when I struggled',
      paragraphs: [
        "When I don't understand something as fast as everyone else, my first thought used to be \"what's wrong with me?\" Now I tell myself I just haven't learned it the way I need to learn it yet. I split it into simple parts, ask how other people learned it, and practice. It's the same as skating: a kickflip doesn't lock in until you've done it wrong enough times to do it right.",
        "When I'm on a deadline with something I just learned, my brain races through every solution and every wrong turn. So I step back and break what I know into smaller pieces. I'm still looking at the whole picture, but now it's 8-bit chunks from the 64-bit process.",
      ],
    },
    {
      title: 'GitHub, branching and version control',
      paragraphs: [
        "On Cascade I set up our repository and the tests that run on every change. Teammates work on their own branches, open pull requests, and I review and merge them so main always works. My own projects work the same way: this portfolio is built from small pull requests, and each one is tested and deployed by GitHub Actions.",
      ],
    },
  ],
}

/** career.md: where I was, where I am, and where I'm going. */
export const CAREER = {
  heading: "Where I'm going.",
  paragraphs: [
    "I was a real estate broker and a sales trainer. Now I'm at i.c.stars, building real software. Next, I want a role between the customer and the engineers.",
  ],
  points: [
    'Short term: a tech sales or solutions engineering role, where I can explain what a product really does',
    'Next: Product Specialist, then Product Developer, learning how an idea becomes something real',
    'Long term: Full Stack Engineer, then founding my own company, Step In',
  ],
  sections: [
    {
      title: 'The roles I want, and why',
      paragraphs: [
        "Tech sales and solutions engineering fit what I already am. I've sold, and I've trained salespeople. Now I build the software too, so I can listen to what a customer needs, explain it to the engineers, and explain the product back to the customer in plain words. That's the job I want: the person who speaks both languages.",
      ],
    },
    {
      title: 'My values',
      paragraphs: ['The five values I lead with are integrity, accountability, growth, curiosity and resilience. Here is what three of them look like in practice:'],
      points: [
        "Integrity: I keep a client's data safe even when it costs me a feature, like keeping Cascade's AI local-only for Medline. Before I add any tool, I ask \"where does this data go?\" and write the answer down.",
        "Accountability: when I commit to a deadline, I hit it, or I tell my team early that I won't. The moment I see a task slipping, I post the new date in the team chat that same day.",
        'Growth: I learn by building real things and asking why they work.',
      ],
    },
    {
      title: 'How I work best',
      paragraphs: [
        "I work best when there is a clear goal and everyone knows how to move with it. When the whole team is on the same page, work gets done. What drives me right now is finishing this program and landing a job where I can keep growing.",
      ],
    },
  ],
}

/** wellness.md: financial, emotional, mental and physical habits from the program. */
export const WELLNESS = {
  heading: 'How I take care of myself.',
  paragraphs: [
    "Fourteen weeks of i.c.stars taught me that how I handle money, stress and my own head matters as much as what I can build.",
  ],
  points: [],
  sections: [
    {
      title: 'Financial',
      paragraphs: [
        'I built a 14-week budget where every dollar has a job, including savings. I put a set amount toward a savings goal every week. The change I made: I put money aside on purpose for the things I get impulsive about, so an impulse buy comes out of that and not out of my savings.',
      ],
    },
    {
      title: 'Emotional',
      paragraphs: [
        "Under stress I mostly feel annoyance and boredom. Annoyance shows up when people aren't trying as hard as they can, and I used to disengage from that person completely. Now I ask what their roadblocks are. Boredom shows up when a project isn't moving, and I used to just do everything nobody else was doing. Now I look for the root cause of why nothing is moving, and I'm patient.",
        'I also work on my self-talk. "There is no point in me doing this" became "If I want to grow, I have to go."',
      ],
    },
    {
      title: 'Mental',
      paragraphs: ['My resets for the moments that used to throw me off:'],
      points: [
        "Presenting something new and my brain freezes: I look past everyone, say my last line to myself, and go from there.",
        "Too many people talking to me at once: I tell them, \"Hey, y'all can't all talk to me at once,\" and take them one at a time.",
        'A deadline on something I just learned: I step back and break it into smaller pieces.',
        'When the pressure is on, I breathe, pause and ground myself before I answer. It shows I am solving the problem, not rushing to an answer.',
      ],
    },
    {
      title: 'Physical',
      paragraphs: [
        "Skateboarding keeps me moving, and when I'm not at a keyboard I'm outside, usually at the lake or downtown. It's also where I learned that getting better happens one try at a time.",
      ],
    },
  ],
}

/**
 * @typedef {{ id: string, name: string, pitch?: string, status?: string, description: string,
 *             tags?: string[], highlights?: string[], year?: number, image?: string,
 *             imageAlt?: string, live?: string, code?: string }} Project
 * @type {Project[]} newest first
 */
export const PROJECTS = [
  {
    id: 'pulse',
    name: 'Pulse',
    year: 2026,
    pitch: 'My Tech Expo project: how well is Chicago serving its residents?',
    description:
      "Pulse turns the City of Chicago's open data into answers a resident can use. Type your neighborhood or address to get a report card on city services, how long 311 requests wait compared with the rest of the city, your ward and alderman, and the free clinics closest to you. It grades all 77 community areas A to F, and shows that the same 311 request takes longer to close in the poorest neighborhoods than in the richest. Pulse Rent, part of the same suite, checks a building's violations and complaints before you sign a lease.",
    highlights: [
      'All 77 community areas graded A to F on city services',
      'Who waits longer: 311 wait times by neighborhood income',
      'Health access map with city clinics and community health centers',
      'Pulse Rent: check a Chicago building before you rent it',
    ],
    tags: ['React', 'Vite', 'Chicago Data Portal', 'OpenStreetMap', 'GitHub Actions'],
    image: 'projects/pulse.png',
    imageAlt: 'The Pulse home page: a search box for a neighborhood or address, question cards, and a map of Chicago neighborhoods graded A to F.',
    live: 'https://firelordray.github.io/city-scorecard/',
    code: 'https://github.com/FIreLordRay/city-scorecard',
  },
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
