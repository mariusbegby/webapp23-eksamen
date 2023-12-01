import type { Question } from "@/types"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

type QuestionRequestBody = {
  question: string
  type: string
}

export async function GET() {
  try {
    const questions = await prisma.question.findMany()
    return NextResponse.json({ success: true, data: questions })
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
  const { question, type } = (await request.json()) as QuestionRequestBody

  if (!question || !type) {
    return NextResponse.json(
      { success: false, error: "Question text and type is required" },
      { status: 400 },
    )
  }

  try {
    const newQuestion: Question = await prisma.question.create({
      data: {
        question,
        type,
      },
    })

    return NextResponse.json({ success: true, data: newQuestion })
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
