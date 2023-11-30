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
            {athlete.meta?.heartrate !== null && (
              <p className="text-lg text-gray-800 dark:text-gray-100">
                Hjertefrekvens: {athlete.meta?.heartrate} slag pr. minutt
              </p>
            )}
            {athlete.meta?.watt !== null && (
              <p className="text-lg text-gray-800 dark:text-gray-100">
                Terskelwatt: {athlete.meta?.watt} watt
              </p>
            )}
            {athlete.meta?.speed !== null && (
              <p className="text-lg text-gray-800 dark:text-gray-100">
                Terskelfart: {athlete.meta?.speed} km/t
              </p>
            )}
          </div>

          <div className="rounded-lg bg-indigo-50 p-4 shadow dark:bg-indigo-950">
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
              Økter
            </h2>
            <p>TODO: Vis i tabell?</p>
          </div>

          <div className="rounded-lg bg-indigo-50 p-4 shadow dark:bg-indigo-950">
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
              Rapporter
            </h2>
            <p>TODO: Vis i tabell?</p>
          </div>
        </section>
      )}
    </Page>
  )
}
