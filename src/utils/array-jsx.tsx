export function array_jsx_join(
  arr: JSX.Element[],
  delimeter?: JSX.Element | string
): JSX.Element {
  if (!Array.isArray(arr) || arr.length === 0)
    return <>[array_jsx_join] empty array</>
  let delim: JSX.Element = <br />
  if (typeof delimeter === 'string') {
    delim = <span>{delimeter}</span>
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
