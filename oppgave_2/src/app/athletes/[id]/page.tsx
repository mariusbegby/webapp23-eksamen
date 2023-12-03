"use client"

import { useEffect, useState } from "react"
import type { Athlete } from "@/types"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Page } from "@/components/PageTemplate"

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

  const sports = Array.from(
    new Set(athlete?.activities?.map((activity) => activity.sport) ?? []),
  )
  const tags = Array.from(
    new Set(athlete?.activities?.map((activity) => activity.tags) ?? []),
  )
  const reportStatuses = ["Ingen rapport", "no", "low", "normal", "high"]

  const filteredAndSortedActivities = athlete?.activities
    ?.filter((activity) => {
      if (filterSport && activity.sport !== filterSport) return false
      if (filterTag && activity.tags !== filterTag) return false
      if (
        filterReportStatus &&
        activity.ActivityReport &&
        (activity.ActivityReport.status != "no"
          ? "Reported"
          : "Not reported") !== filterReportStatus
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
    } else {
      console.error(data.error)
    }
  }

  useEffect(() => {
    const fetchAthletes = async () => {
      const response = await fetch(`/api/athletes/${id}`)
      const data = (await response.json()) as ResponseData

      if (data.success) {
        setAthlete(data.data)
      } else {
        console.error(data.error)
      }
    }

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
      fetchAthlete().catch(console.error)
    } else {
      console.error(data.error)
    }
  }

  const handleDuplicateActivity = async (activityId: number) => {
    const response = await fetch(
      `/api/athletes/${id}/activities/${activityId}`,
      {
        method: "POST",
      },
    )

    const data = (await response.json()) as ResponseData

    if (data.success) {
      fetchAthlete().catch(console.error)
    } else {
      console.error(data.error)
    }
  }

  const handleDownloadActivity = async (activityId: number) => {
    // TODO: Download activity as excel file
    console.log(athlete?.activities?.find((a) => a.id === activityId))
  }

  return (
    <Page title="Utøverdetaljer" backButtonLocation="/">
      <Link
        href={`/athletes/${id}/edit`}
        className="mb-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
      >
        Endre utøver
      </Link>

      <Link
        href={`/athletes/${id}/activities/new`}
        className="mb-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
      >
        Opprett treningsøkt
      </Link>

      {athlete && (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
          <div className="rounded-lg bg-indigo-50 p-4 shadow dark:bg-indigo-950">
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
          <div className="rounded-lg bg-indigo-50 p-4 shadow dark:bg-indigo-950">
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

          <div className="rounded-lg bg-indigo-50 p-4 shadow dark:bg-indigo-950">
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
              Treningsmål
            </h2>
            <Link
              href={`/athletes/${id}/goals/new`}
              className="mb-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
            >
              Opprett treningsmål
            </Link>

            {athlete.goals && athlete.goals.length > 0 ? (
              <ul className="mt-4 list-inside list-disc">
                {athlete.goals.map((goal) => (
                  <li key={goal.id}>
                    Navn: {goal.name}, Mål: {goal.goal}, Dato: {goal.date}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg text-gray-800 dark:text-gray-100">
                Ingen treningsmål registrert.
              </p>
            )}
          </div>

          <div className="rounded-lg bg-indigo-50 p-4 shadow dark:bg-indigo-950">
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
              Konkurranser
            </h2>
            <Link
              href={`/athletes/${id}/contests/new`}
              className="mb-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
            >
              Opprett konkurranse
            </Link>

            {athlete.contests && athlete.contests.length > 0 ? (
              <ul className="mt-4 list-inside list-disc">
                {athlete.contests.map((contest) => (
                  <li key={contest.id}>
                    Navn: {contest.name}, Mål: {contest.goal}, Dato:{" "}
                    {contest.date}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg text-gray-800 dark:text-gray-100">
                Ingen treningsmål registrert.
              </p>
            )}
          </div>

          <div className="col-span-full mt-8">
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
              Økter m/ rapporter
            </h2>
            <p className="mb-4">
              TODO: Filtrere på type aktivitet og tag. Kunne filtrere på status
              til rapporten. Kunne sortere etter dato. Hver rad skal vise:
              Status på økten/rapporten, duplisere økten (uten svar), slette
              økten, endre økten, laste ned økten som excel (kun om den har
              rapport), rapportere økten om den ikke har rapport.
            </p>

            <div className="mb-4">
              <label className="font-medium text-gray-700 dark:text-gray-200">
                Type:{" "}
                <select
                  value={filterSport ?? ""}
                  onChange={(e) => {
                    setFilterSport(e.target.value || null)
                  }}
                  className="mr-4 mt-1 w-32 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Alle</option>
                  {sports.map((sport) => (
                    <option key={sport} value={sport}>
                      {sport}
                    </option>
                  ))}
                </select>
              </label>

              <label className="font-medium text-gray-700 dark:text-gray-200">
                Tagger:{" "}
                <select
                  value={filterTag ?? ""}
                  onChange={(e) => {
                    setFilterTag(e.target.value || null)
                  }}
                  className="mr-4 mt-1 w-32 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Alle</option>
                  {tags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </label>

              <label className="font-medium text-gray-700 dark:text-gray-200">
                Rapport status:{" "}
                <select
                  value={filterReportStatus ?? ""}
                  onChange={(e) => {
                    setFilterReportStatus(e.target.value || null)
                  }}
                  className="mr-4 mt-1 w-32 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Alle</option>
                  {reportStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="font-medium text-gray-700 dark:text-gray-200">
                Dato sortering:{" "}
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value as "asc" | "desc")
                  }}
                  className="mr-4 mt-1 w-32 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="asc">Stigende</option>
                  <option value="desc">Synkende</option>
                </select>
              </label>
            </div>

            <table className="min-w-full divide-y divide-gray-200 border dark:divide-gray-700 dark:bg-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200"
                  >
                    Navn
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200"
                  >
                    Dato
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200"
                  >
                    Tags
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200"
                  >
                    Handlinger
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                {filteredAndSortedActivities?.map((activity) => (
                  <tr key={activity.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 transition-colors duration-200 ease-in-out hover:text-black dark:text-gray-300 dark:hover:text-white">
                      <Link href={`/athletes/${id}/activities/${activity.id}`}>
                        {activity.name}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {activity.sport}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {new Date(activity.date).toLocaleDateString("nb-NO")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {activity.tags}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      <Link
                        href={`/athletes/${id}/activities/${activity.id}/edit`}
                        className="mr-2 rounded bg-indigo-600 px-2 py-1 text-white hover:bg-indigo-700"
                      >
                        Endre
                      </Link>
                      <button
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="mr-2 rounded bg-red-600 px-2 py-1 text-white hover:bg-red-700"
                      >
                        Slett
                      </button>
                      <button
                        onClick={() => handleDuplicateActivity(activity.id)}
                        className="mr-2 rounded bg-blue-600 px-2 py-1 text-white hover:bg-blue-700"
                      >
                        Dupliser (TODO)
                      </button>
                      {activity.ActivityReport && (
                        <button
                          onClick={() => handleDownloadActivity(activity.id)}
                          className="mr-2 rounded bg-green-600 px-2 py-1 text-white hover:bg-green-700"
                        >
                          Last ned (TODO)
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </Page>
  )
}
