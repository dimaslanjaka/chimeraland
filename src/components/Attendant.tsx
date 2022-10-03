import { AttendantsData } from '../utils/chimeraland'

type AttendantProps = typeof AttendantsData[number]
export function Attendant(props: AttendantProps) {
  return (
    <>
      <pre>
        <code>{JSON.stringify(props, null, 2)}</code>
      </pre>
    </>
  )
}
