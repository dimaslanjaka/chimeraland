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

export function fixUrl(url: string | URL) {
  let str: string
  if (typeof url === 'string') {
    str = url
  } else {
    str = url.toString()
  }
  return str.replace(/([^:]\/)\/+/g, '$1')
}

export type Nullable<T> = T | null | undefined;

/**
 * transform url string to {@link Nullable}<{@link URL}>
 * @param url
 * @returns
 */
export default function toURL(url: string): Nullable<URL> {
  try {
    if (url.startsWith('/') || url.startsWith('?')) {
      // url is pathname or query
      return new URL('http://not-actually-domain.com/' + url.replace(/^\/+/, ''));
    } else if (url.match(/^https?:\/\//)) {
      // test full url with protocol://
      return new URL(url);
    }
  } catch (error) {
    if (error instanceof Error) console.log(url, error.message);
    return null;
  }
}
