"use client"

import { useEffect, useState } from "react"
import type { Athlete } from "@/types"
import { Parser } from "json2csv"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Page } from "@/components/PageTemplate"
import AthleteActivities from "./ActivitiesTable"
import TrainingContests from "./TrainingContestsTable"
import TrainingGoals from "./TrainingGoalsTable"

type ResponseData = {
  success: boolean
  data: Athlete
  error?: string
}

export default function Athlete() {
  const pathname = usePathname()
  const id = pathname.split("/").pop()

  const [athlete, setAthlete] = useState<Athlete | null>(null)

  const [filterSport, setFilterSport] = useState<string | null>(null)
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [filterReportStatus, setFilterReportStatus] = useState<string | null>(
    null,
  )
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const filteredAndSortedActivities = athlete?.activities
    ?.filter((activity) => {
      if (filterSport && activity.sport !== filterSport) return false
      if (filterTag && activity.tags !== filterTag) return false
      if (
        filterReportStatus &&
        (filterReportStatus === "Ingen rapport"
          ? activity.ActivityReport
          : activity.ActivityReport?.status !== filterReportStatus)
      )
        return false
      return true
    })
    .sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      if (sortOrder === "asc") {
        return dateA.getTime() - dateB.getTime()
      } else {
        return dateB.getTime() - dateA.getTime()
      }
    })

  const fetchAthlete = async () => {
    const response = await fetch(`/api/athletes/${id}`)
    const data = (await response.json()) as ResponseData

    if (data.success) {
      setAthlete(data.data)
    }
  }

  useEffect(() => {
    const fetchAthletes = async () => {
      const response = await fetch(`/api/athletes/${id}`)
      const data = (await response.json()) as ResponseData

      if (data.success) {
        setAthlete(data.data)
      }
    }
    // eslint-disable-next-line no-console
    fetchAthletes().catch(console.error)
  }, [id])

  const handleDeleteActivity = async (activityId: number) => {
    const response = await fetch(
      `/api/athletes/${id}/activities/${activityId}`,
      {
        method: "DELETE",
      },
    )

    const data = (await response.json()) as ResponseData

    if (data.success) {
      // eslint-disable-next-line no-console
      fetchAthlete().catch(console.error)
    }
  }

  const handleDownloadActivity = (activityId: number) => {
    const activity = athlete?.activities?.find((a) => a.id === activityId)
    if (!activity) return

    const parser = new Parser()
    const csv = parser.parse(activity)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `${athlete?.userId}_activity_${activityId}.csv`
    link.click()
  }

  return (
    <Page title="Utøverdetaljer" backButtonLocation="/">
      <div className="grid gap-4">
        <div className="flex gap-4">
          <Link
            href={`/athletes/${id}/edit`}
            className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
          >
            Endre utøver
          </Link>

          <Link
            href={`/athletes/${id}/activities/new`}
            className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
          >
            Opprett treningsøkt
          </Link>
        </div>
        <div className="flex gap-4">
          <Link
            href={`/athletes/${id}/contests/new`}
            className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
          >
            Opprett konkurranse
          </Link>

          <Link
            href={`/athletes/${id}/goals/new`}
            className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
          >
            Opprett treningsmål
          </Link>
        </div>
      </div>

      {athlete && (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
          <div className="">
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
              Utøverinformasjon
            </h2>
            <p className="text-lg text-gray-800 dark:text-gray-100">
              Bruker ID: {athlete.userId}
            </p>
            <p className="text-lg text-gray-800 dark:text-gray-100">
              Sport: {athlete.sport}
            </p>
            <p className="text-lg text-gray-800 dark:text-gray-100">
              Kjønn: {athlete.gender}
            </p>
          </div>

          <div className="">
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
              Ytelsesdata
            </h2>
            {athlete.meta.heartrate !== null && (
              <p className="text-lg text-gray-800 dark:text-gray-100">
                Hjertefrekvens: {athlete.meta.heartrate} slag pr. minutt
              </p>
            )}
            {athlete.meta.watt !== null && (
              <p className="text-lg text-gray-800 dark:text-gray-100">
                Terskelwatt: {athlete.meta.watt} watt
              </p>
            )}
            {athlete.meta.speed !== null && (
              <p className="text-lg text-gray-800 dark:text-gray-100">
                Terskelfart: {athlete.meta.speed} km/t
              </p>
            )}
          </div>

          <TrainingGoals goals={athlete.goals} />

          <TrainingContests contests={athlete.contests} />

          <AthleteActivities
            athlete={athlete}
            filteredAndSortedActivities={filteredAndSortedActivities}
            filterSport={filterSport}
            filterTag={filterTag}
            filterReportStatus={filterReportStatus}
            setFilterSport={setFilterSport}
            setFilterTag={setFilterTag}
            setFilterReportStatus={setFilterReportStatus}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            handleDeleteActivity={handleDeleteActivity}
            handleDownloadActivity={handleDownloadActivity}
          />
        </section>
      )}
    </Page>
  )
}
