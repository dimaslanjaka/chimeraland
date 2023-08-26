import moment from 'moment'
import momentTimezone from 'moment-timezone'

const toTimezone = (dates: momentTimezone.MomentInput, timezone?: string) =>
  momentTimezone(dates).tz(timezone || 'Asia/Jakarta')

/**
 * get random date between two dates
 * @param start moment or Date instance
 * @param end moment or Date instance. default `new Date()`
 * @returns
 */
function randomDate(start: moment.Moment | Date, end?: moment.Moment | Date) {
  let from: moment.Moment, to: moment.Moment
  if (start instanceof Date) {
    from = moment(start)
  } else {
    from = start
  }
  if (end instanceof Date) {
    to = moment(end)
  } else if (!end) {
    to = moment(new Date())
  } else {
    to = end
  }

  return moment(
    from.valueOf() + Math.random() * (to.valueOf() - from.valueOf())
  )
}

// const _d = randomDate(new Date(2012, 0, 1), new Date())

const results: string[] = []
const _from = '2023-03-04T16:20:40+07:00'

while (results.length < 7) {
  const _gen = randomDate(toTimezone(_from)).format()
  if (!results.includes(_gen)) results.push(_gen)
}
console.log(results)
