import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

type AthleteRequestBody = {
  userId: string
  gender: string
  sport: string
  meta: {
    heartrate: number
    watt: number
    speed: number
  }
}

type Athlete = {
  id: number
  gender: string
  sport: string
}

export async function GET() {
  try {
    const athletes = await prisma.athlete.findMany({
      include: {
        meta: {
          include: {
            intensityZones: true,
          },
        },
        activities: {
          include: {
            metricOptions: true,
            intervals: true,
            questions: true,
          },
        },
        reports: true,
        contests: true,
      },
    })
    return NextResponse.json({ success: true, data: athletes })
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

export async function POST(request: NextRequest) {
  const { userId, gender, sport, meta } =
    (await request.json()) as AthleteRequestBody

  if (!gender || !sport) {
    return NextResponse.json(
      { success: false, error: "Sport and gender are required" },
      { status: 400 },
    )
  }

  try {
    const newAthlete: Athlete = await prisma.athlete.create({
      data: {
        userId,
        gender,
        sport,
        meta: {
          create: {
            heartrate: meta.heartrate,
            watt: meta.watt,
            speed: meta.speed,
            intensityZones: {
              create: [
                // Heartrate zones
                { type: "heartrate", zone: 1, intensity: meta.heartrate * 0.5 },
                { type: "heartrate", zone: 2, intensity: meta.heartrate * 0.6 },
                { type: "heartrate", zone: 3, intensity: meta.heartrate * 0.7 },
                { type: "heartrate", zone: 4, intensity: meta.heartrate * 0.8 },
                { type: "heartrate", zone: 5, intensity: meta.heartrate * 0.9 },
                // Watt zones
                { type: "watt", zone: 1, intensity: meta.watt * 0.5 },
                { type: "watt", zone: 2, intensity: meta.watt * 0.6 },
                { type: "watt", zone: 3, intensity: meta.watt * 0.7 },
                { type: "watt", zone: 4, intensity: meta.watt * 0.8 },
                { type: "watt", zone: 5, intensity: meta.watt * 0.9 },
                // Speed zones
                { type: "speed", zone: 1, intensity: meta.speed * 0.5 },
                { type: "speed", zone: 2, intensity: meta.speed * 0.6 },
                { type: "speed", zone: 3, intensity: meta.speed * 0.7 },
                { type: "speed", zone: 4, intensity: meta.speed * 0.8 },
                { type: "speed", zone: 5, intensity: meta.speed * 0.9 },
              ],
            },
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: newAthlete })
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
