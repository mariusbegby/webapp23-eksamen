import type { Sport } from "@/types"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

type Interval = {
  duration: string
  zone: string
}

type MetricOptions = {
  heartrate: boolean
  watt: boolean
  speed: boolean
}

type ActivityRequestBody = {
  date: string
  name: string
  tags: string
  sport: Sport
  questionIds: string[]
  metricOptions: MetricOptions
  intervals: Interval[]
}

export async function GET(request: NextRequest) {
  const athleteId = request.nextUrl.pathname.split("/")[3]

  try {
    const activities = await prisma.activity.findMany({
      where: {
        Athlete: {
          userId: athleteId,
        },
      },
      include: {
        questions: true,
        intervals: true,
        metricOptions: true,
      },
    })

    return NextResponse.json({ success: true, data: activities })
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
  const { date, name, tags, sport, questionIds, metricOptions, intervals } =
    (await request.json()) as ActivityRequestBody
  const athleteId = request.nextUrl.pathname.split("/")[3]

  try {
    const activity = await prisma.activity.create({
      data: {
        date: new Date(date),
        name: name,
        tags: tags,
        sport: sport,
        Athlete: {
          connect: { userId: athleteId },
        },
        questions: {
          connect: questionIds.map((questionId) => ({ id: questionId })),
        },
        intervals: {
          create: intervals.map((interval) => ({
            duration: parseInt(interval.duration),
            zone: parseInt(interval.zone),
          })),
        },
        metricOptions: {
          create: metricOptions,
        },
      },
    })

    return NextResponse.json({ success: true, data: activity })
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
