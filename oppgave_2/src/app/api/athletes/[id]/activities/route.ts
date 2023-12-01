import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

type Interval = {
  duration: string
  intensity: string
}

type ActivityRequestBody = {}

export async function POST(request: NextRequest) {}
