import type { DownloadPlatform } from '../components/PlatformModal'

type NavigatorLike = Pick<Navigator, 'platform' | 'userAgent'> & {
  userAgentData?: { platform?: string }
}

export function detectDownloadPlatform(navigatorLike: NavigatorLike = navigator): DownloadPlatform | null {
  const value = `${navigatorLike.userAgentData?.platform || ''} ${navigatorLike.platform || ''} ${navigatorLike.userAgent || ''}`.toLowerCase()
  if (/macintosh|mac ?os|macintel|macarm|darwin/.test(value)) return 'mac'
  if (/windows|win32|win64/.test(value)) return 'windows'
  return null
}
