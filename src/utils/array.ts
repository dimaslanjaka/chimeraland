/**
 * unique array
 * * array of string,number
 * * array of object by object key
 * @param arr
 * @param field key name (for array of object)
 * @returns
 * @see {@link https://stackoverflow.com/a/67322087/6404439}
 * @example
 * arrayOfObjUniq({p:'x',n:'x'},{p:'23',n:'x'},{p:'x',n:'5g'}, 'p'); // [{p:'x',n:'x'},{p:'23',n:'x'}]
 */
export function array_unique<T extends any[]>(arr: T, field?: string) {
  if (Array.isArray(arr)) {
    if (typeof field !== 'string') {
      return arr.filter(function (x, i, a) {
        return a.indexOf(x) === i
      }) as T
    } else {
      return arr.filter(
        (a, i) => arr.findIndex((s) => a[field] === s[field]) === i
      ) as T
    }
  } else {
    throw new Error('array param must be instance of ARRAY')
  }
}
