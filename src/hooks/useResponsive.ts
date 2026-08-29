import { useState, useEffect } from 'react'

export interface Breakpoints {
  isMobile: boolean   // < 640px, or short-height screens
  isTablet: boolean   // 640–1023px
  isDesktop: boolean  // >= 1024px
  width: number
  height: number
}

export function useResponsive(): Breakpoints {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1280,
  )
  const [height, setHeight] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 800,
  )

  useEffect(() => {
    const handler = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const isShort = height < 700

  return {
    isMobile: width < 640 || isShort,
    isTablet: width >= 640 && width < 1024 && !isShort,
    isDesktop: width >= 1024 && !isShort,
    width,
    height,
  }
}
