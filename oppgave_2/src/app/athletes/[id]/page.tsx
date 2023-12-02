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

  useEffect(() => {
    const fetchAthlete = async () => {
      const response = await fetch(`/api/athletes/${id}`)
      const data = (await response.json()) as ResponseData

      if (data.success) {
        setAthlete(data.data)
      } else {
        console.error(data.error)
      }
    }

    fetchAthlete().catch(console.error)
  }, [id])

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

      <p>TODO: Opprett økt?</p>

      <p>TODO: Opprett treningsmål/konkurranser?</p>

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
              Konkurranser
            </h2>
            <Link
              href={`/athletes/${id}/contests/new`}
              className="mb-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
            >
              TODO: Opprett konkurranse
            </Link>
          </div>

          <div className="rounded-lg bg-indigo-50 p-4 shadow dark:bg-indigo-950">
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
              Treningsmål
            </h2>
            <Link
              href={`/athletes/${id}/goals/new`}
              className="mb-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
            >
              TODO: Opprett treningsmål
            </Link>
          </div>

          <div className="col-span-full mt-8">
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
              Økter m/ rapporter
            </h2>
            <p className="mb-4">
              TODO: Vis i tabell? Skal kunne: Filtrere på type aktivitet og tag.
              Kunne filtrere på status til rapporten. Kunne sortere etter dato.
              Hver rad skal vise: Status på økten/rapporten, duplisere økten
              (uten svar), slette økten, endre økten, laste ned økten som excel
              (kun om den har rapport), rapportere økten om den ikke har
              rapport.
            </p>

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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                {athlete.activities.map((activity) => (
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
