"use client"

import { useEffect, useState } from "react"
import type { Athlete } from "@/types"
import Link from "next/link"

import { AthleteList } from "@/components/AthleteList"
import { Page } from "@/components/PageTemplate"
import { Sidebar } from "@/components/Sidebar"

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
    <Page title="Dashbord">
      <div className="grid gap-6">
        <Link
          href="/new-athlete"
          className="mb-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
        >
          Legg til ny utøver
        </Link>
        <AthleteList athletes={athletes} />
      </div>
    </Page>
  )
}
