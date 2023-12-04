import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

type ActivityReportRequestBody = {
  date: string
  status: string
  ReportIntervals: ReportInterval[]
  ReportQuestions: ReportQuestion[]
}

type ReportInterval = {
  intervalId: string
  duration: string
  intensityMin: string
  intensityMax: string
  intensityAvg: string
  heartRateMin?: string
  heartRateMax?: string
  heartRateAvg?: string
  speedMin?: string
  speedMax?: string
  speedAvg?: string
  wattMin?: string
  wattMax?: string
  wattAvg?: string
}

type ReportQuestion = {
  questionId: string
  question: string
  type: string
  answer: string
}

export async function POST(request: NextRequest) {
  const { date, status, ReportIntervals, ReportQuestions } =
    (await request.json()) as ActivityReportRequestBody
  const athleteId = request.nextUrl.pathname.split("/")[3]
  const activityId = request.nextUrl.pathname.split("/")[5]

  if (
    !date ||
    !status ||
    ReportIntervals.length === 0 ||
    ReportQuestions.length === 0
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "date, status, ReportIntervals and ReportQuestions are required",
      },
      { status: 400 },
    )
  }

  try {
    const data = {
      date: new Date(date),
      status: status,
      Activity: {
        connect: { id: parseInt(activityId) },
      },
      Athlete: {
        connect: { userId: athleteId },
      },
      ReportIntervals: {
        create: ReportIntervals.map((interval) => ({
          duration: parseInt(interval.duration),
          intensityMin: parseInt(interval.intensityMin),
          intensityMax: parseInt(interval.intensityMax),
          intensityAvg: parseInt(interval.intensityAvg),
          heartRateMin: interval.heartRateMin
            ? parseInt(interval.heartRateMin)
            : 0,
          heartRateMax: interval.heartRateMax
            ? parseInt(interval.heartRateMax)
            : 0,
          heartRateAvg: interval.heartRateAvg
            ? parseInt(interval.heartRateAvg)
            : 0,
          speedMin: interval.speedMin ? parseInt(interval.speedMin) : 0,
          speedMax: interval.speedMax ? parseInt(interval.speedMax) : 0,
          speedAvg: interval.speedAvg ? parseInt(interval.speedAvg) : 0,
          wattMin: interval.wattMin ? parseInt(interval.wattMin) : 0,
          wattMax: interval.wattMax ? parseInt(interval.wattMax) : 0,
          wattAvg: interval.wattAvg ? parseInt(interval.wattAvg) : 0,
          Interval: {
            connect: { id: interval.intervalId },
          },
        })),
      },
      ReportQuestions: {
        create: ReportQuestions.map((question) => ({
          answer: question.answer,
          Question: {
            connect: { id: question.questionId },
          },
        })),
      },
    }

    const activity = await prisma.activityReport.create({
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
