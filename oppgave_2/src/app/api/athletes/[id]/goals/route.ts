import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

type TrainingGoalRequestBody = {
  name: string
  date: string
  goal: string
  comment: string
}

export async function GET(request: NextRequest) {
  const athleteId = request.nextUrl.pathname.split("/")[3]

  try {
    const goals = await prisma.trainingGoal.findMany({
      where: {
        Athlete: {
          userId: athleteId,
        },
      },
    })

    return NextResponse.json({ success: true, data: goals })
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
  const { name, date, goal, comment } =
    (await request.json()) as TrainingGoalRequestBody

  const athleteId = request.nextUrl.pathname.split("/")[3]

  if (!name || !date || !goal) {
    return NextResponse.json(
      {
        success: false,
        error: "Name, date and goal is required",
      },
      { status: 400 },
    )
  }

  const existingGoals = await prisma.trainingGoal.findMany({
    where: {
      Athlete: {
        userId: athleteId,
      },
    },
  })

  const goalsWithSameYear = existingGoals.filter((goal) => {
    const contestYear = new Date(goal.date).getFullYear()
    const newContestYear = new Date(date).getFullYear()

    return contestYear === newContestYear
  })

  if (goalsWithSameYear.length >= 3) {
    return NextResponse.json(
      {
        success: false,
        error:
          "An athlete cannot have more than three training goals in a given year",
      },
      { status: 400 },
    )
  }

  try {
    const newGoal = await prisma.trainingGoal.create({
      data: {
        name,
        date: new Date(date),
        goal: parseInt(goal),
        comment,
        Athlete: {
          connect: {
            userId: athleteId,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: newGoal })
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
