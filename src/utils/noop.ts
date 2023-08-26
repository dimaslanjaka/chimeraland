/**
 * No operations
 * @param _args
 */
export function noop(..._args: any[]) {
  //
}
export function catchMsg(e: any) {
  if (e.message) console.log(e.message)
}

export default noop
