export type Athlete = {
  userId: string
  gender: string
  sport: string
  meta: {
    heartrate: number | null
    watt: number | null
    speed: number | null
  } | null
}
