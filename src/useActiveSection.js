import { useEffect, useState } from 'react'

/**
 * Which of these sections is in the middle of the screen: the explorer and the tabs light
 * up the "file" you're reading. Pass a list that never changes (a module-level constant).
 *
 * @param {string[]} ids section ids, in page order
 */
export default function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      // A thin band across the middle of the screen: whichever section crosses it is "open".
      { rootMargin: '-40% 0px -55% 0px' },
    )
    for (const id of ids) {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    }
    return () => observer.disconnect()
  }, [ids])

  return active
}
