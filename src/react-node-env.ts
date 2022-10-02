/**
 * reverse Partial interfaces to Immutable interface
 */
export type unPartial<T> = {
  [P in keyof T]-?: T[P]
}
/**
 * Turn Immutable interfaces to Mutable interfaces
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

/**
 * remove readonly modifier
 */
export type Writeable<T> = { -readonly [P in keyof T]: T[P] }
/**
 * remove readonly modifier
 */
export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> }
