"use client"

import { useState } from "react"
import type { Athlete } from "@/types"
import { v4 } from "uuid"

import { Page } from "@/components/PageTemplate"
import StatusMessage from "@/components/StatusMessage"

const uuidv4: () => string = v4

type ResponseData = {
  success: boolean
  error?: string
  data?: Athlete
}

export default function NewAthlete() {
  const [athlete, setAthlete] = useState<Athlete>({
    id: "",
    userId: uuidv4(),
    sport: "",
    gender: "",
    meta: {
      id: 0,
      heartrate: 0,
      watt: 0,
      speed: 0,
    },
  })

  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const value =
      e.target.name === "heartrate" ||
      e.target.name === "watt" ||
      e.target.name === "speed"
        ? parseInt(e.target.value, 10)
        : e.target.value
    setAthlete((prevAthlete) => {
      if (
        e.target.name === "heartrate" ||
        e.target.name === "watt" ||
        e.target.name === "speed"
      ) {
        return {
          ...prevAthlete,
          meta: {
            ...prevAthlete.meta,
            [e.target.name]: value,
          },
        }
      } else {
        return {
          ...prevAthlete,
          [e.target.name]: value,
        }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response = await fetch("/api/athletes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(athlete),
    })
    if (response.ok) {
      setError(null)
      const responseData = (await response.json()) as ResponseData
      setMessage(
        `Utøver med bruker id ${responseData.data?.userId} ble lagt til.`,
      )
      setAthlete({
        id: "",
        userId: uuidv4(),
        sport: "",
        gender: "",
        meta: {
          id: 0,
          heartrate: 0,
          watt: 0,
          speed: 0,
        },
      })
    } else {
      const data = (await response.json()) as ResponseData

      if (data.error) {
        setMessage(null)
        switch (data.error) {
          case "Sport, gender and meta are required":
            setError("Feltene sport og kjønn må fylles ut.")
            break
          default:
            setError(
              "En ukjent feil har oppstått. Vennligst oppdater siden og prøv igjen.",
            )
            break
        }
      }
    }
  }

  return (
    <Page title="Legg til utøver" backButtonLocation="/">
      <form onSubmit={handleSubmit} className="space-y-4">
        <StatusMessage errorMessage={error} statusMessage={message} />

        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Bruker ID:
            <input
              type="text"
              name="userId"
              value={athlete.userId}
              onChange={handleChange}
              disabled
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
            />
          </label>
        </div>
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Sport: <span className="text-red-600">*</span>
            <select
              name="sport"
              value={athlete.sport}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Velg type sport</option>
              <option value="Løping">Løping</option>
              <option value="Sykling">Sykling</option>
              <option value="Ski">Ski</option>
              <option value="Triatlon">Triatlon</option>
              <option value="Svømming">Svømming</option>
              <option value="Styrke">Styrke</option>
              <option value="Annet">Annet</option>
            </select>
          </label>
        </div>
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Kjønn: <span className="text-red-600">*</span>
            <select
              name="gender"
              value={athlete.gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Velg kjønn</option>
              <option value="Mann">Mann</option>
              <option value="Kvinne">Kvinne</option>
              <option value="Annet">Annet</option>
            </select>
          </label>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block font-medium text-gray-700 dark:text-gray-200">
              Hjertefrekvens:
              <input
                type="number"
                placeholder="slag pr. minutt"
                name="heartrate"
                value={athlete.meta.heartrate ?? 0}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div className="flex-1">
            <label className="block font-medium text-gray-700 dark:text-gray-200">
              Terkselwatt:
              <input
                type="number"
                placeholder="watt"
                name="watt"
                value={athlete.meta.watt ?? 0}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div className="flex-1">
            <label className="block font-medium text-gray-700 dark:text-gray-200">
              Terskelfart:
              <input
                type="number"
                placeholder="km/t"
                name="speed"
                value={athlete.meta.speed ?? 0}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Legg til utøver
        </button>
      </form>
    </Page>
  )
}
