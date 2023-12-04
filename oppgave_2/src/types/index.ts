export type Athlete = {
  id: string
  userId: string
  gender: string
  sport: string
  meta: Meta
  activities?: Activity[]
  contests?: Contest[]
  goals?: Goal[]
}

export type Goal = {
  id: number
  name: string
  date: string
  goal: number
  comment: string
}

export type Contest = {
  id: number
  name: string
  date: string
  location: string
  goal: string
  sport: Sport
  priority: Priority
  comment: string
}

export type Activity = {
  id: number
  date: string
  name: string
  tags: string
  sport: Sport
  intervals: Interval[]
  questions: Question[]
  metricOptions: MetricOptions
  ActivityReport?: ActivityReport
  TrainingGoal?: Goal
  TrainingContest?: Contest
}

type ActivityReport = {
  id: number
  date: Date
  status: string
}

export type MetricOptions = {
  id?: string
  heartrate: boolean
  watt: boolean
  speed: boolean
}

export type Interval = {
  id: string
  duration: number
  zone: number
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
  id?: number
  type: string
  zone: number
  intensity: number
}

export type Question = {
  id?: string
  question: string
  type: string
}
