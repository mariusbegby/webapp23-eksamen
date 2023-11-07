import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

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

function calculateAnswer(task: Task) {
  const [a, b] = task.data.split("|")
  switch (task.type) {
    case "add":
      return Number(a) + Number(b)
    case "subtract":
      return Number(a) - Number(b)
    case "multiply":
      return Number(a) * Number(b)
    case "divide":
      return Number(a) / Number(b)
  }
}

// TODO: Denne skal brukes til å "samle" svarene (om du ikke bruker database)
const answers = new Map<Task["id"], { attempts: number }>()

export async function PUT(request: NextRequest) {
  const { id, answer } = (await request.json()) as {
    id: string
    answer: number
  }

  console.log("PUT", id, answer)

  const task = tasks.find((task) => task.id === id)
  if (!task) {
    return NextResponse.json(
      { success: false, error: "Invalid id" },
      { status: 400 },
    )
  }

  const correctAnswer = calculateAnswer(task) // replace with your actual calculation function
  if (answer !== correctAnswer) {
    console.log("Incorrect answer")
    // TODO: add attempts to answers Map
    return NextResponse.json(
      { success: false, error: "Incorrect answer" },
      { status: 400 },
    )
  }

  // TODO: add answer to Map
  console.log("Correct answer")

  return NextResponse.json({ success: true }, { status: 200 })
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
