const moment = require('moment-timezone')

const dates = [
  '2016-04-12T15:13:11.733Z',
  '2019-02-01T00:01:01.001Z',
  '2017-02-01T00:01:01.001Z',
  '2022-09-28T20:26:37+07:00',
  '2022-09-29T04:26:37+07:00',
  '2022-09-29T03:26:37+07:00',
  '2022-09-28T22:26:37+07:00',
  '2022-09-29T12:26:37+07:00',
  '2022-09-29T10:26:37+07:00',
  '2022-09-29T05:26:37+07:00',
  '2022-09-28T21:26:37+07:00',
  '2022-09-28T23:26:37+07:00',
  '2022-09-29T00:26:37+07:00',
  '2022-09-29T02:26:37+07:00',
  '2022-09-29T06:26:37+07:00',
  '2022-09-29T08:26:37+07:00',
  '2022-09-29T09:26:37+07:00',
  '2022-09-29T11:26:37+07:00',
  '2022-09-29T07:26:37+07:00',
  '2022-09-29T20:26:37+07:00',
  '2022-09-29T21:26:37+07:00',
  '2022-09-29T13:26:37+07:00',
  '2022-09-30T02:26:37+07:00',
  '2022-09-30T04:26:37+07:00',
  '2022-09-29T15:26:37+07:00',
  '2022-09-29T01:26:37+07:00',
  '2022-09-29T18:26:37+07:00',
  '2022-09-29T17:26:37+07:00',
  '2022-09-29T14:26:37+07:00',
  '2022-09-30T07:26:37+07:00',
  '2022-11-25T20:35:17+07:00',
  '2022-11-25T20:35:17+07:00',
  '2022-11-25T20:35:17+07:00',
  '2022-11-25T20:35:17+07:00',
  '2022-11-25T20:35:17+07:00',
  '2022-11-25T20:35:17+07:00',
  '2022-11-25T20:35:17+07:00',
  '2022-11-25T20:35:17+07:00',
  '2022-11-25T20:35:17+07:00',
  '2022-11-25T20:35:17+07:00',
  '2022-11-25T20:35:17+07:00',
  '2022-11-25T20:35:17+07:00',
  '2022-11-25T20:35:17+07:00',
  '2022-11-25T20:35:17+07:00',
  '2022-11-25T20:35:17+07:00',
  '2022-11-25T20:35:17+07:00',
  '2023-02-08T21:16:58+07:00',
  '2023-02-08T21:16:58+07:00',
  '2023-02-08T21:16:58+07:00',
  '2023-02-08T21:16:58+07:00',
  '2023-02-08T21:16:58+07:00',
  '2023-02-08T21:16:58+07:00',
  '2023-02-08T21:16:58+07:00',
  '2023-02-08T21:16:58+07:00',
  '2023-02-08T21:16:58+07:00',
  '2023-02-08T21:16:58+07:00',
  '2023-02-08T21:16:58+07:00',
  '2023-02-08T21:16:58+07:00',
  '2023-02-08T21:16:58+07:00',
  '2023-02-13T12:32:50+07:00',
  '2023-02-13T12:32:50+07:00',
  '2023-02-13T12:32:50+07:00',
  '2023-02-13T12:42:21+07:00',
  '2023-02-13T12:42:21+07:00',
  '2023-02-16T20:53:20+07:00',
  '2023-02-16T20:53:20+07:00',
  '2023-02-16T20:53:20+07:00',
  '2023-02-16T20:53:20+07:00',
  '2023-02-16T20:53:20+07:00',
  '2023-02-16T20:53:20+07:00',
  '2023-02-18T14:09:01+07:00',
  '2023-02-18T14:09:01+07:00',
  '2023-02-18T14:09:01+07:00',
  '2023-02-24T19:55:41+07:00',
  '2023-02-24T19:55:41+07:00',
  '2023-02-24T19:55:41+07:00',
  '2023-03-10T19:30:17+07:00',
  '2023-03-10T19:30:17+07:00',
  '2023-03-10T19:30:17+07:00',
  '2023-03-10T19:30:17+07:00',
  '2023-03-10T19:30:17+07:00',
  '2023-03-10T19:30:17+07:00',
  '2023-03-10T19:30:17+07:00',
  '2023-03-10T19:30:17+07:00',
  '2023-03-10T19:30:17+07:00',
  '2023-03-10T19:30:17+07:00',
  '2023-03-10T19:30:17+07:00',
  '2023-03-10T19:30:17+07:00',
  '2023-03-10T19:30:17+07:00',
  '2023-03-10T19:30:17+07:00',
  '2023-03-10T19:30:17+07:00',
  '2023-03-28T09:10:08+07:00',
  '2023-03-28T09:10:08+07:00'
].map((str) => moment(str))

var maximumDate = new Date(Math.max.apply(null, dates))
var minimumDate = new Date(Math.min.apply(null, dates))

console.log({ maximumDate, minimumDate })
