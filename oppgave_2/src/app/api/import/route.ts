import { NextResponse } from "next/server"
import { v4 } from "uuid"

import { prisma } from "@/lib/prisma"

const uuidv4: () => string = v4

type AthleteData = {
  gender: string
  sport: string
  meta: {
    heartrate: number
    watt: number
    speed: number
  }
}

type ExternalApiResponse = {
  pages: number
  success: boolean
  hasMore: boolean
  page: number
  data: AthleteData[]
}

export async function POST() {
  let page = 1
  let hasMore = true

  while (hasMore) {
    try {
      const response = await fetch(
        `https://webapp-api.vercel.app/api/users?page=${page}`,
      )
      const data = (await response.json()) as ExternalApiResponse

      if (data.success) {
        for (const athlete of data.data) {
          const translatedGender = athlete.gender == "male" ? "Mann" : "Kvinne"
          let translatedSport = ""

          switch (athlete.sport) {
            case "running":
              translatedSport = "Løping"
              break
            case "cycling":
              translatedSport = "Sykling"
              break
            case "skiing":
              translatedSport = "Ski"
              break
            case "triathlon":
              translatedSport = "Triathlon"
              break
            case "swimming":
              translatedSport = "Svømming"
              break
            case "strength":
              translatedSport = "Styrke"
              break
            case "other":
              translatedSport = "Annet"
              break
            default:
              translatedSport = "Annet"
              break
          }

          await prisma.athlete.create({
            data: {
              userId: uuidv4(),
              gender: translatedGender,
              sport: translatedSport,
              meta: {
                create: {
                  heartrate: athlete.meta.heartrate,
                  watt: athlete.meta.watt,
                  speed: athlete.meta.speed,
                  intensityZones: {
                    create: [
                      // Heartrate zones
                      {
                        type: "heartrate",
                        zone: 1,
                        intensity: athlete.meta.heartrate * 0.5,
                      },
                      {
                        type: "heartrate",
                        zone: 2,
                        intensity: athlete.meta.heartrate * 0.6,
                      },
                      {
                        type: "heartrate",
                        zone: 3,
                        intensity: athlete.meta.heartrate * 0.7,
                      },
                      {
                        type: "heartrate",
                        zone: 4,
                        intensity: athlete.meta.heartrate * 0.8,
                      },
                      {
                        type: "heartrate",
                        zone: 5,
                        intensity: athlete.meta.heartrate * 0.9,
                      },
                      // Watt zones
                      {
                        type: "watt",
                        zone: 1,
                        intensity: athlete.meta.watt * 0.5,
                      },
                      {
                        type: "watt",
                        zone: 2,
                        intensity: athlete.meta.watt * 0.6,
                      },
                      {
                        type: "watt",
                        zone: 3,
                        intensity: athlete.meta.watt * 0.7,
                      },
                      {
                        type: "watt",
                        zone: 4,
                        intensity: athlete.meta.watt * 0.8,
                      },
                      {
                        type: "watt",
                        zone: 5,
                        intensity: athlete.meta.watt * 0.9,
                      },
                      // Speed zones
                      {
                        type: "speed",
                        zone: 1,
                        intensity: athlete.meta.speed * 0.5,
                      },
                      {
                        type: "speed",
                        zone: 2,
                        intensity: athlete.meta.speed * 0.6,
                      },
                      {
                        type: "speed",
                        zone: 3,
                        intensity: athlete.meta.speed * 0.7,
                      },
                      {
                        type: "speed",
                        zone: 4,
                        intensity: athlete.meta.speed * 0.8,
                      },
                      {
                        type: "speed",
                        zone: 5,
                        intensity: athlete.meta.speed * 0.9,
                      },
                    ],
                  },
                },
              },
            },
          })
        }

        hasMore = data.hasMore
        page += 1
      } else {
        return NextResponse.json(
          { success: false, error: "Failed to fetch data from external API" },
          { status: 400 },
        )
      }
    } catch (error: unknown) {
      let message = "An error occurred"
      if (error instanceof Error) {
        message = error.message
      }
      return NextResponse.json(
        { success: false, error: message },
        { status: 400 },
      )
    }
  }

  return NextResponse.json({ success: true })
}
