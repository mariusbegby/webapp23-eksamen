import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { Athlete, IntensityZone } from "@/types"

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

  const maxHeartRate = Math.max(
    ...ReportIntervals.map((i) => parseInt(i.heartRateMax ?? "0")),
  )
  const maxSpeed = Math.max(
    ...ReportIntervals.map((i) => parseInt(i.speedMax ?? "0")),
  )
  const maxWatt = Math.max(
    ...ReportIntervals.map((i) => parseInt(i.wattMax ?? "0")),
  )

  const athlete = await prisma.athlete.findUnique({
    where: { userId: athleteId },
    include: { meta: true },
  })

  if (athlete) {
    if (
      maxHeartRate > athlete.meta.heartrate ||
      maxSpeed > athlete.meta.speed ||
      maxWatt > athlete.meta.watt
    ) {
      const updatedAthlete = await prisma.athlete.update({
        where: { userId: athleteId },
        data: {
          meta: {
            update: {
              heartrate:
                maxHeartRate > 0
                  ? Math.max(maxHeartRate, athlete.meta.heartrate)
                  : athlete.meta.heartrate,
              speed:
                maxSpeed > 0
                  ? Math.max(maxSpeed, athlete.meta.speed)
                  : athlete.meta.speed,
              watt:
                maxWatt > 0
                  ? Math.max(maxWatt, athlete.meta.watt)
                  : athlete.meta.watt,
            },
          },
        },
        include: { meta: true },
      })

      const zones = generateIntensityZones(updatedAthlete)
      if (zones) {
        for (const zone of zones) {
          await prisma.intensityZone.update({
            where: {
              metaId_type_zone: {
                metaId: updatedAthlete.meta.id,
                type: zone.type,
                zone: zone.zone,
              },
            },
            data: {
              intensity: zone.intensity,
              type: zone.type,
            },
          })
        }
      }
    }
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
