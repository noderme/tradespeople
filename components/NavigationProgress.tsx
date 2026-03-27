'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false, minimum: 0.3, trickleSpeed: 200 })

export function NavigationProgress() {
  const pathname = usePathname()
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Stop bar when route finishes — small delay so it's visible on fast navigations
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => NProgress.done(), 200)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [pathname])

  // Start bar on any internal link click or button[data-nprogress] click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement

      // Button explicitly tagged to trigger progress (e.g. signout)
      if (target.closest('[data-nprogress]')) {
        NProgress.start()
        return
      }

      const anchor = target.closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href) return
      // Skip external, hash, mailto, _blank
      if (
        href.startsWith('http') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        anchor.target === '_blank'
      ) return

      NProgress.start()
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}
