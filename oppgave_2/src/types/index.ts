export type Athlete = {
  userId: string
  gender: string
  sport: string
  meta: Meta
}

type Meta = {
  id: number
  heartrate: number | null
  watt: number | null
  speed: number | null
  intensityZones?: IntensityZone[]
}

export type IntensityZone = {
  type: string
  zone: number
  intensity: number
}

export type Question = {
  id: string
  question: string
  type: string
}
