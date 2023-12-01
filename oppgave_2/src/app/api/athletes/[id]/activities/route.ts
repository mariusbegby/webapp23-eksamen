import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

type Interval = {
  duration: string
  intensity: string
}

type ActivityRequestBody = {
  athleteId: number
  date: string
  name: string
  tags: string
  type: string
  questions: string[]
  intervals: Interval[]
}

export async function POST(request: NextRequest) {
  const { athleteId, date, name, tags, type, questions, intervals } =
    (await request.json()) as ActivityRequestBody

  if (!date || !name || !tags || !type) {
    return NextResponse.json(
      { success: false, error: "Date, name, tags, and type are required" },
      { status: 400 },
    )
  }

  try {
    const newActivity = await prisma.activity.create({
      data: {
        date: new Date(date),
        name,
        tags,
        type,
        athleteId,
      },
    })

    for (const question of questions) {
      await prisma.question.create({
        data: {
          question,
          type: "text",
          activities: {
            connect: {
              id: newActivity.id,
            },
          },
        },
      })
    }

    for (const interval of intervals) {
      await prisma.interval.create({
        data: {
          duration: parseInt(interval.duration),
          intensity: parseInt(interval.intensity),
          activityId: newActivity.id,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: newActivity,
    })
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
