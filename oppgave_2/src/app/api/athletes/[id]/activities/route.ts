import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

type Interval = {
  type: string
  duration: string
  intensity: string
}

type ActivityRequestBody = {
  date: string
  name: string
  tags: string
  type: string
  questions: string[]
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
  const { date, name, tags, type, questions, intervals } =
    (await request.json()) as ActivityRequestBody
  const athleteId = request.nextUrl.pathname.split("/")[3]

  try {
    const activity = await prisma.activity.create({
      data: {
        date: new Date(date),
        name: name,
        tags: tags,
        type: type,
        Athlete: {
          connect: { userId: athleteId },
        },
        questions: {
          connect: questions.map((questionId) => ({ id: questionId })),
        },
        intervals: {
          create: intervals.map((interval) => ({
            type: interval.type,
            duration: parseInt(interval.duration),
            intensity: parseInt(interval.intensity),
          })),
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
