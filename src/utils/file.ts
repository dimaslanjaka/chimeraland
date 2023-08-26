/**
 * path from public
 * @param path
 * @returns
 */
export function fromPublic(path: string) {
  return process.env.PUBLIC_URL + path
}

export function fromSrc(path: string) {
  return [process.env.PUBLIC_URL, '../src', path].join('/')
}
