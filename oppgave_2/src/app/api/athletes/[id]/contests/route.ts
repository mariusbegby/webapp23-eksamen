import type { Priority, Sport } from "@/types"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

type TrainingContestRequestBody = {
  name: string
  date: string
  location: string
  goal: string
  sport: Sport
  priority: Priority
  comment: string
}

export async function GET(request: NextRequest) {
  const athleteId = request.nextUrl.pathname.split("/")[3]

  try {
    const contests = await prisma.trainingContest.findMany({
      where: {
        Athlete: {
          userId: athleteId,
        },
      },
    })

    return NextResponse.json({ success: true, data: contests })
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
  const { name, date, location, goal, sport, priority, comment } =
    (await request.json()) as TrainingContestRequestBody

  const athleteId = request.nextUrl.pathname.split("/")[3]

  if (!name || !date || !location || !goal || !sport || !priority) {
    return NextResponse.json(
      {
        success: false,
        error: "Name, date, location, goal, sport and priority is required",
      },
      { status: 400 },
    )
  }

  const existingContests = await prisma.trainingContest.findMany({
    where: {
      Athlete: {
        userId: athleteId,
      },
    },
  })

  const contestsWithSameYear = existingContests.filter((contest) => {
    const contestYear = new Date(contest.date).getFullYear()
    const newContestYear = new Date(date).getFullYear()

    return contestYear === newContestYear
  })

  if (contestsWithSameYear.length >= 3) {
    return NextResponse.json(
      {
        success: false,
        error:
          "An athlete cannot have more than three contests in a given year",
      },
      { status: 400 },
    )
  }

  try {
    const newContest = await prisma.trainingContest.create({
      data: {
        name,
        date: new Date(date),
        location,
        goal,
        sport,
        priority,
        comment,
        Athlete: {
          connect: {
            userId: athleteId,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: newContest })
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
