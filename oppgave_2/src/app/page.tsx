"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { AthleteList } from "@/components/AthleteList"

type Athlete = {
  id: number
  gender: string
  sport: string
}

type ResponseData = {
  success: boolean
  data: Athlete[]
  error?: string
}

export default function Home() {
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
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-2">
      <h1 className="mb-4 text-4xl">Athlete Management</h1>
      <div className="mx-auto w-full max-w-2xl rounded-xl bg-white p-6 shadow-md">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <Image
              src="/img/logo.svg"
              alt="ChitChat Logo"
              width={48}
              height={48}
            />
          </div>
          <div>
            <div className="text-xl font-medium text-black">Athlete List</div>
            <p className="text-gray-500">
              You have {athletes.length} athletes.
            </p>
          </div>
        </div>
        <AthleteList athletes={athletes} />
        <Link
          href="/add-athlete"
          className="mt-6 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
        ></Link>
      </div>
    </div>
  )
}
