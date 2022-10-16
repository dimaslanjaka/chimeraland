/** is development? */
export const isDev = /dev/gi.test(String(process.env.NODE_ENV))
