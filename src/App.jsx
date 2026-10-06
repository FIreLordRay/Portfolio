import { ArrowRight } from 'lucide-react'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import FeaturedProject from './components/FeaturedProject.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import ProjectCard from './components/ProjectCard.jsx'
import SectionHeading from './components/SectionHeading.jsx'
import Toolbelt from './components/Toolbelt.jsx'
import { PROJECTS, SITE } from './data/site.js'

const featured = PROJECTS.filter((project) => project.image)
const others = PROJECTS.filter((project) => !project.image)

/** One page: intro, about, projects, toolbelt, contact. All the words live in src/data/site.js. */
export default function App() {
  return (
    <>
      {/* Parked above the top edge until a keyboard user tabs to it. */}
      <a
        href="#main"
        className="absolute top-4 left-4 z-50 -translate-y-24 rounded-lg bg-accent px-4 py-2 font-semibold text-bg transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <About />

        <section id="projects" aria-labelledby="projects-heading" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
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

        <Toolbelt />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
