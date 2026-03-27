'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false, trickleSpeed: 200 })

export function NavigationProgress() {
  const pathname = usePathname()

  // Stop bar when route finishes
  useEffect(() => {
    NProgress.done()
  }, [pathname])

  // Start bar on any internal link click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href) return
      // Skip external, hash, mailto, and _blank links
      if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || anchor.target === '_blank') return
      NProgress.start()
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}
