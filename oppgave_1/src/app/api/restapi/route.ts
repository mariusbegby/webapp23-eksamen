import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { calculateAnswer } from "@/lib/utils"
import { type Task } from "@/types"

const tasks: Task[] = [
  {
    id: "123",
    text: "Skriv resultatet av regneoperasjonen",
    data: "9|2",
    type: "add",
  },
  {
    id: "234",
    text: "Skriv resultatet av regneoperasjonen",
    data: "3|2",
    type: "add",
  },
  {
    id: "356",
    text: "Skriv resultatet av regneoperasjonen",
    data: "3|2",
    type: "multiply",
  },
]

const answers = new Map<Task["id"], { attempts: number }>()

export async function PUT(request: NextRequest) {
  const { id, answer } = (await request.json()) as {
    id: string
    answer: number
  }

  const task = tasks.find((task) => task.id === id)
  if (!task) {
    return NextResponse.json(
      { success: false, error: "Invalid id" },
      { status: 400 },
    )
  }

  const correctAnswer = calculateAnswer(task)
  if (answer !== correctAnswer) {
    const currentAttempts = answers.get(id)?.attempts ?? 0
    if (currentAttempts >= 3) {
      return NextResponse.json(
        { success: false, error: "Maximum attempts reached", attempts: 3 },
        { status: 400 },
      )
    }

    answers.set(id, { attempts: currentAttempts + 1 })

    return NextResponse.json(
      {
        success: false,
        error: "Incorrect answer",
        attempts: currentAttempts + 1,
      },
      { status: 400 },
    )
  }

  const currentAttempts = answers.get(id)?.attempts ?? 0
  answers.set(id, { attempts: currentAttempts })

  return NextResponse.json(
    { success: true, attempts: currentAttempts },
    { status: 200 },
  )
}

export function GET(request: NextRequest) {
  const count = Number(request.nextUrl.searchParams.get("count"))

  if (isNaN(count) || count < 1)
    return NextResponse.json({ success: false, error: "Invalid count" })

  const selectedTasks = tasks.slice(0, count)

  return NextResponse.json(
    { success: true, data: selectedTasks },
    { status: 200 },
  )
}
