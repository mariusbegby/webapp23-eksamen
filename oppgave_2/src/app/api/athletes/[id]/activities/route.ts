import type { MetricOptions, Sport } from "@/types"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

type Interval = {
  duration: string
  zone: string
}

type ActivityRequestBody = {
  date: string
  name: string
  tags: string
  sport: Sport
  questionIds: string[]
  metricOptions: MetricOptions
  intervals: Interval[]
  contestId?: string
  trainingGoalId?: string
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
        TrainingContest: true,
        TrainingGoal: true,
        ActivityReport: true,
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
  const {
    date,
    name,
    tags,
    sport,
    questionIds,
    metricOptions,
    intervals,
    contestId,
    trainingGoalId,
  } = (await request.json()) as ActivityRequestBody
  const athleteId = request.nextUrl.pathname.split("/")[3]

  if (
    !name ||
    !date ||
    !tags ||
    !sport ||
    questionIds.length === 0 ||
    intervals.length === 0
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Name, date, tags, sport, questionIds and intervals is required",
      },
      { status: 400 },
    )
  }

  try {
    const data = {
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
      ...(contestId && {
        TrainingContest: {
          connect: { id: parseInt(contestId) },
        },
      }),
      ...(trainingGoalId && {
        TrainingGoal: {
          connect: { id: parseInt(trainingGoalId) },
        },
      }),
    }

    const activity = await prisma.activity.create({
      data: data,
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
