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

export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop()

  try {
    const athlete = await prisma.athlete.findUnique({
      where: { userId: id },
      include: { meta: true },
    })

    if (!athlete) {
      return NextResponse.json(
        { success: false, error: "No athlete found with this id" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: athlete })
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

export async function PUT(request: NextRequest) {
  const { userId, gender, sport, meta } =
    (await request.json()) as AthleteRequestBody

  if (!gender || !sport) {
    return NextResponse.json(
      { success: false, error: "Sport and gender are required" },
      { status: 400 },
    )
  }

  try {
    const updatedAthlete = await prisma.athlete.update({
      where: { userId: userId },
      data: {
        sport: sport,
        gender: gender,
        meta: {
          update: {
            heartrate: meta.heartrate,
            watt: meta.watt,
            speed: meta.speed,
          },
        },
      },
      include: { meta: true },
    })

    return NextResponse.json({ success: true, data: updatedAthlete })
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
