export function array_jsx_join(
  arr: JSX.Element[],
  delimeter?: JSX.Element | string
) {
  if (!Array.isArray(arr)) return arr
  if (arr.length === 0) return arr
  let delim: JSX.Element = <br />
  if (typeof delimeter === 'string') {
    delim = <p>{delimeter}</p>
  } else if (typeof delimeter !== 'undefined') {
    delim = delimeter
  }
  return arr.reduce((prev, curr) => (
    <>
      {prev}
      {delim}
      {curr}
    </>
  ))
}
