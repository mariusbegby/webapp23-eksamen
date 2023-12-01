import type { Athlete, IntensityZone } from "@/types"
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
      include: {
        meta: {
          include: {
            intensityZones: true,
          },
        },
        activities: true,
      },
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

function generateIntensityZones(athlete: Athlete) {
  const zones: IntensityZone[] = []

  if (!athlete.meta.intensityZones) return

  const percentages = [0.5, 0.6, 0.7, 0.8, 0.9]

  for (const zone of athlete.meta.intensityZones) {
    percentages.forEach((percentage, index) => {
      if (!athlete.meta.heartrate || !athlete.meta.watt || !athlete.meta.speed)
        return

      switch (zone.type) {
        case "heartrate":
          zones.push({
            type: zone.type,
            zone: index + 1,
            intensity: athlete.meta.heartrate * percentage,
          })
          break
        case "watt":
          zones.push({
            type: zone.type,
            zone: index + 1,
            intensity: athlete.meta.watt * percentage,
          })
          break
        case "speed":
          zones.push({
            type: zone.type,
            zone: index + 1,
            intensity: athlete.meta.speed * percentage,
          })
          break
      }
    })
  }

  return zones
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
    const updatedAthlete: Athlete = await prisma.athlete.update({
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
      include: {
        meta: {
          include: {
            intensityZones: true,
          },
        },
      },
    })

    const zones = generateIntensityZones(updatedAthlete)

    if (!zones)
      return NextResponse.json({ success: true, data: updatedAthlete })

    for (const zone of zones) {
      await prisma.intensityZone.update({
        where: {
          metaId_type_zone: {
            metaId: updatedAthlete.meta.id,
            type: zone.type,
            zone: zone.zone,
          },
        },
        data: { intensity: zone.intensity },
      })
    }

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
