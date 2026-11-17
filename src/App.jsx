import { ArrowRight } from 'lucide-react'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import Explorer from './components/Explorer.jsx'
import FeaturedProject from './components/FeaturedProject.jsx'
import Footer from './components/Footer.jsx'
import Hero from './components/Hero.jsx'
import NeoWs from './components/NeoWs.jsx'
import ProjectCard from './components/ProjectCard.jsx'
import SectionHeading from './components/SectionHeading.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import Toolbelt from './components/Toolbelt.jsx'
import SpaceBackground from './background/SpaceBackground.jsx'
import { PROJECTS, SITE } from './data/site.js'
import usePage from './usePage.js'

const featured = PROJECTS.filter((project) => project.image)
const others = PROJECTS.filter((project) => !project.image)

/**
 * Dressed as a code editor: a title bar, the explorer down the left, and each file in it its
 * own page, an open "file" (see usePage.js). All the words live in src/data/site.js.
 */
export default function App() {
  const active = usePage()

  return (
    <>
      <SpaceBackground />
      {/* Parked above the top edge until a keyboard user tabs to it. */}
      <a
        href="#main"
        className="absolute top-4 left-4 z-50 -translate-y-24 rounded-lg bg-accent px-4 py-2 font-semibold text-bg transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <SiteHeader />
      <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
        <Explorer active={active} />
        <div className="min-w-0">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
            <main id="main">
              {active === 'top' && <Hero />}
              {active === 'about' && <About />}
              {active === 'projects' && (
                <section id="projects" aria-labelledby="projects-heading" className="py-20">
                  <SectionHeading id="projects-heading" path="projects">
                    Here&apos;s what I&apos;ve built.
                  </SectionHeading>
                  <div className="space-y-10">
                    {featured.map((project) => (
                      <FeaturedProject key={project.id} project={project} />
                    ))}
                  </div>
                  <ul className="mt-10 grid gap-6 md:grid-cols-2">
                    {others.map((project) => (
                      <li key={project.id}>
                        <ProjectCard project={project} />
                      </li>
                    ))}
                  </ul>
                  <a href={SITE.github} className="mt-8 inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-fg">
                    everything else is on GitHub
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </section>
              )}
              {active === 'neows' && <NeoWs />}
              {active === 'toolbelt' && <Toolbelt />}
              {active === 'contact' && <Contact />}
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </>
  )
}
