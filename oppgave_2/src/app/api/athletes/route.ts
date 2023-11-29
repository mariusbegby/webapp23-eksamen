import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

type AthleteRequestBody = {
  userId: string
  gender: string
  sport: string
}

type Athlete = {
  id: number
  gender: string
  sport: string
}

export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const athletes = await prisma.athlete.findMany()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return NextResponse.json({ success: true, data: athletes })
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
  const { userId, gender, sport } = (await request.json()) as AthleteRequestBody

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    const newAthlete: Athlete = await prisma.athlete.create({
      data: { userId, gender, sport },
    })

    return NextResponse.json({ success: true, data: newAthlete })
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
