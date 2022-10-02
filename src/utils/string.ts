/**
 * escape regex string
 * @param string
 * @returns
 */
export function escapeRegex(string: string, method: '1' | '2' = '1') {
  if (method === '1' || !method)
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
  if (method === '2')
    return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d')
}

/**
 * capitalize string first letter of each word which mixed with symbols
 * @param str
 * @param moreSymbols add more symbols
 * @returns
 */
export function capitalizer(
  str: string,
  moreSymbols: ConcatArray<string> = []
) {
  let symbols = ['-', ' ']
  if (Array.isArray(moreSymbols)) {
    // concatenate more symbols
    symbols = symbols.concat(moreSymbols).filter(function (x, i, a) {
      return a.indexOf(x) === i
    })
  }
  symbols.forEach((symbol) => {
    str = str
      .split(symbol)
      .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
      .join(symbol)
  })
  return str
}
