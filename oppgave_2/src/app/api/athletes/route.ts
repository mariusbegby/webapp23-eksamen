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
    const athletes = await prisma.athlete.findMany({ include: { meta: true } })
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
