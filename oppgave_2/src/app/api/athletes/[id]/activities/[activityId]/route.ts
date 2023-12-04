import type { MetricOptions, Sport } from "@/types"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

type Interval = {
  id?: string
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
  const activityId = parseInt(request.nextUrl.pathname.split("/")[5])

  try {
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        metricOptions: true,
        intervals: true,
        questions: true,
        TrainingContest: true,
        TrainingGoal: true,
        ActivityReport: true,
      },
    })

    if (!activity) {
      return NextResponse.json(
        { success: false, error: "Activity not found" },
        { status: 404 },
      )
    }

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

export async function PUT(request: NextRequest) {
  const activityId = parseInt(request.nextUrl.pathname.split("/")[5])
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

  try {
    await prisma.interval.deleteMany({
      where: { activityId: activityId },
    })

    const data = {
      date: new Date(date),
      name: name,
      tags: tags,
      sport: sport,
      questions: {
        connect: questionIds.map((questionId) => ({ id: questionId })),
      },
      intervals: {
        create: intervals
          .filter((interval) => !interval.id)
          .map((interval) => ({
            duration: parseInt(interval.duration),
            zone: parseInt(interval.zone),
          })),
      },
      metricOptions: {
        upsert: {
          where: { id: metricOptions.id },
          update: metricOptions,
          create: metricOptions,
        },
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

    const activity = await prisma.activity.update({
      where: { id: activityId },
      data: data,
      include: {
        metricOptions: true,
        intervals: true,
        questions: true,
        TrainingContest: true,
        TrainingGoal: true,
        ActivityReport: true,
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

export async function DELETE(request: NextRequest) {
  const activityId = parseInt(request.nextUrl.pathname.split("/")[5])

  try {
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: { intervals: true, questions: true },
    })

    if (!activity) {
      return NextResponse.json(
        { success: false, error: "Activity not found" },
        { status: 404 },
      )
    }

    const disconnectQuestions = activity.questions.map((question) =>
      prisma.question.update({
        where: { id: question.id },
        data: { activities: { disconnect: { id: activityId } } },
      }),
    )

    const deleteReportIntervals = activity.intervals.map((interval) =>
      prisma.reportInterval.deleteMany({
        where: { intervalId: interval.id },
      }),
    )

    const deleteIntervals = prisma.interval.deleteMany({
      where: { activityId: activityId },
    })

    const deleteActivity = prisma.activity.delete({
      where: {
        id: activityId,
      },
    })

    const deleteMetricOptions = prisma.metricOptions.deleteMany({
      where: {
        id: activity.metricOptionsId,
      },
    })

    await prisma.$transaction([
      ...disconnectQuestions,
      ...deleteReportIntervals,
      deleteIntervals,
      deleteActivity,
      deleteMetricOptions,
    ])

    return NextResponse.json({ success: true })
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
