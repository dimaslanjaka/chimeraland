import { siteUrl } from '../config'

export function isValidHttpUrl(string: string | URL) {
  let url: URL

  try {
    url = new URL(string)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}

export function pathname2url(pathname: string) {
  const url = new URL(siteUrl)
  url.pathname = pathname
  return url.toString()
}
