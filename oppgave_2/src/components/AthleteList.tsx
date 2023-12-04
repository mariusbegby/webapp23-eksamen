"use client"

import { useState } from "react"
import { FaBolt, FaCopy, FaHeartbeat, FaTachometerAlt } from "react-icons/fa"
import type { Athlete } from "@/types"
import Link from "next/link"

type AthleteListProps = {
  athletes: Athlete[]
}

export function AthleteList({ athletes }: AthleteListProps) {
  const [search, setSearch] = useState("")

  const filteredAthletes = athletes
    .filter((athlete) =>
      athlete.userId.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => (b.activities?.length ?? 0) - (a.activities?.length ?? 0))

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    }
  }

  const tasks = athletes.flatMap(
    (athlete) =>
      athlete.activities
        ?.filter(
          (activity) =>
            !activity.ActivityReport && new Date(activity.date) < new Date(),
        )
        .map((activity) => ({ ...activity, athlete })) ?? [],
  )

  return (
    <>
      <div>
        <h2 className="text-lg font-bold">Oppgaver</h2>
        {tasks.length > 0 ? (
          <table className="mt-4 min-w-full divide-y divide-gray-200 border dark:divide-gray-700 dark:bg-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200"
                >
                  Bruker ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200"
                >
                  Økt ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200"
                >
                  Antall intervaller
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200"
                >
                  Antall spørsmål
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200"
                >
                  Rapport status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200"
                >
                  Dato
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {tasks.map((task, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 transition-colors duration-200 ease-in-out hover:text-black dark:text-gray-300 dark:hover:text-white">
                    <button
                      onClick={() => copyToClipboard(task.athlete.userId)}
                      className="mr-2 text-indigo-600 hover:text-indigo-900"
                    >
                      <FaCopy />
                    </button>
                    <Link href={`/athletes/${task.athlete.userId}`}>
                      {task.athlete.userId}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {task.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {task.questions.length}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {task.intervals.length}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {task.ActivityReport ? "Rapportert" : "Ikke rapportert"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {new Date(task.date).toLocaleDateString("nb-NO")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mb-4 mt-2 text-gray-500 dark:text-gray-300">
            Ingen oppgaver funnet
          </p>
        )}
      </div>

      <div>
        <h2 className="text-lg font-bold">Utøvere</h2>
        {filteredAthletes.length > 0 ? (
          <>
            <input
              type="text"
              placeholder="Søk på Bruker ID"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
              className="mt-2 min-w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
            />

            <table className="mt-4 min-w-full divide-y divide-gray-200 border dark:divide-gray-700 dark:bg-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200"
                  >
                    Bruker ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200"
                  >
                    Sport
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200"
                  >
                    Kjønn
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200"
                  >
                    Antall økter
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200"
                  >
                    Egenskaper
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                {filteredAthletes.map((athlete) => (
                  <tr key={athlete.userId}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 transition-colors duration-200 ease-in-out hover:text-black dark:text-gray-300 dark:hover:text-white">
                      <button
                        onClick={() => copyToClipboard(athlete.userId)}
                        className="mr-2 text-indigo-600 hover:text-indigo-900"
                      >
                        <FaCopy />
                      </button>
                      <Link href={`/athletes/${athlete.userId}`}>
                        {athlete.userId}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {athlete.sport}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {athlete.gender}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {athlete.activities?.length}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          <FaHeartbeat className="mr-1 text-red-800" />
                          {athlete.meta.heartrate}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          <FaBolt className="mr-1 text-green-800" />
                          {athlete.meta.watt}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          <FaTachometerAlt className="mr-1 text-blue-800" />
                          {athlete.meta.speed}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p className="text-gray-500 dark:text-gray-300">
            Ingen utøvere funnet
          </p>
        )}
      </div>
    </>
  )
}
