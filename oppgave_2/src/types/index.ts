export type Athlete = {
  userId: string
  gender: string
  sport: string
  meta: Meta
  activities: Activity[]
}

type Activity = {
  id: number
  date: string
  name: string
  tags: string
  sport: Sport
  intervals: Interval[]
  questions: Question[]
  metricOptions: MetricOptions
}

export type MetricOptions = {
  heartrate: boolean
  watt: boolean
  speed: boolean
}

type Interval = {
  duration: number
  intensity: number
}

type Meta = {
  id: number
  heartrate: number | null
  watt: number | null
  speed: number | null
  intensityZones?: IntensityZone[]
}

export type Sport =
  | "Løping"
  | "Sykling"
  | "Ski"
  | "Triatlon"
  | "Svømming"
  | "Styrke"
  | "Annet"
  | ""

export type Priority = "A" | "B" | "C" | ""

export type IntensityZone = {
  id: number
  type: string
  zone: number
  intensity: number
}

export type Question = {
  id: string
  question: string
  type: string
}
