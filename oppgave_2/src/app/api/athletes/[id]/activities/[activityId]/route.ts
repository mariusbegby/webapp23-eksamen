import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function DELETE(request: NextRequest) {
  const activityId = parseInt(request.nextUrl.pathname.split("/")[5])

  try {
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: { questions: true },
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

    const deleteIntervals = prisma.interval.deleteMany({
      where: {
        activityId: activityId,
      },
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
