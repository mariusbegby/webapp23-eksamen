"use client"

import { useEffect, useState } from "react"
import type { Athlete } from "@/types"
import Link from "next/link"

import { AthleteList } from "@/components/AthleteList"
import { Sidebar } from "@/components/dashboard/Sidebar"

type ResponseData = {
  success: boolean
  data: Athlete[]
  error?: string
}

export default function Dashboard() {
  const [athletes, setAthletes] = useState<Athlete[]>([])

  useEffect(() => {
    const fetchAthletes = async () => {
      const response = await fetch("/api/athletes")
      const data = (await response.json()) as ResponseData

      if (data.success) {
        setAthletes(data.data)
      } else {
        console.error(data.error)
      }
    }

    fetchAthletes().catch(console.error)
  }, [])

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="grid gap-6">
            <Link
              href="/add-athlete"
              className="mt-6 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
            >
              Add Athlete
            </Link>
            <AthleteList athletes={athletes} />
          </div>
        </main>
      </div>
    </div>
  )
}
