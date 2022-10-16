/**
 * pick random items from array
 * @param items
 * @returns
 */
export function array_random<T extends any[]>(items: T): T[number] {
  return items[Math.floor(Math.random() * items.length)]
}

/**
 * unique array
 * * array of string,number
 * * array of object by object key
 * @param arr
 * @param field key name (for array of object)
 * @returns
 *
 * @example
 * arrayOfObjUniq({p:'x',n:'x'},{p:'23',n:'x'},{p:'x',n:'5g'}, 'p'); // [{p:'x',n:'x'},{p:'23',n:'x'}]
 *
 * @link https://stackoverflow.com/a/67322087/6404439
 */
export function array_unique<T extends any[]>(arr: T, field?: string): T {
  if (Array.isArray(arr)) {
    if (typeof field !== 'string') {
      arr = arr.filter(function (x, i, a) {
        return a.indexOf(x) === i
      }) as T
    } else {
      arr = arr.filter(
        (a, i) => arr.findIndex((s) => a[field] === s[field]) === i
      ) as T
    }
    return arr.filter((item) => {
      if (typeof item === 'string') return item.trim().length > 0
      if (Array.isArray(item)) return item.length > 0
      return true
    }) as T
  } else {
    throw new Error('array param must be instance of ARRAY')
  }
}
