import debug from 'debug'

export function Logger(name: string) {
  return debug(name)
}
