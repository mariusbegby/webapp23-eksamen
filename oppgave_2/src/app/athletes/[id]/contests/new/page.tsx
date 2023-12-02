"use client"

import { useState } from "react"
import type { Priority, Sport } from "@/types"
import { usePathname } from "next/navigation"

import { Page } from "@/components/PageTemplate"

type ResponseData = {
  success: boolean
  data: JSON
  error?: string
}

type Contest = {
  name: string
  date: string
  location: string
  goal: string
  sport: Sport
  priority: Priority
  comment: string
}

export default function NewContest() {
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [contest, setContest] = useState<Contest>({
    name: "",
    date: new Date().toISOString().split("T")[0],
    location: "",
    goal: "",
    sport: "",
    priority: "",
    comment: "",
  })

  const pathname = usePathname()
  const pathParts = pathname.split("/")
  const id = pathParts[pathParts.length - 3]

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setContest((prevContest) => ({
      ...prevContest,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(contest)

    const response = await fetch(`/api/athletes/${id}/contests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contest),
    })

    if (response.ok) {
      setContest({
        name: "",
        date: new Date().toISOString().split("T")[0],
        location: "",
        goal: "",
        sport: "",
        priority: "",
        comment: "",
      })
      setError(null)
      setMessage("Konkurransen ble opprettet!")
      const responseData = (await response.json()) as ResponseData
      console.log(responseData)
    } else {
      const data = (await response.json()) as ResponseData

      if (data.error) {
        setMessage(null)
        switch (data.error) {
          case "Name, date, location, goal, sport and priority is required":
            setError(
              "Feltene for navn, dato, sted, mål, sport og prioritet må fylles ut.",
            )
            break
          case "An athlete cannot have more than three contests in a given year":
            setError(
              "En utøver kan ikke ha mer enn tre konkurranser i samme år.",
            )
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
    <Page title="Legg til konkurranse" backButtonLocation={`/athletes/${id}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
            role="alert"
          >
            <strong className="font-bold">Feilmelding: </strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {message && (
          <div
            className="relative rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700"
            role="alert"
          >
            <strong className="font-bold">Status: </strong>
            <span className="block sm:inline">{message}</span>
          </div>
        )}

        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Navn:
            <input
              type="text"
              name="name"
              placeholder="Navn på konkurranse"
              onChange={handleInputChange}
              value={contest.name}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
            />
          </label>
        </div>
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Dato:
            <input
              type="date"
              name="date"
              onChange={handleInputChange}
              value={contest.date}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
            />
          </label>
        </div>
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Sted:
            <input
              type="text"
              name="location"
              placeholder="Lokasjon for konkurranse"
              onChange={handleInputChange}
              value={contest.location}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
            />
          </label>
        </div>
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Mål:
            <input
              type="text"
              name="goal"
              placeholder="Beskriv konkurransemålet"
              onChange={handleInputChange}
              value={contest.goal}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
            />
          </label>
        </div>
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Sport:
            <select
              name="sport"
              onChange={handleInputChange}
              value={contest.sport}
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
            Prioritet:
            <select
              name="priority"
              onChange={handleInputChange}
              value={contest.priority}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Velg prioritet</option>
              <option value="A">A (høy)</option>
              <option value="B">B (middels)</option>
              <option value="C">C (lav)</option>
            </select>
          </label>
        </div>
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Kommentar:
            <input
              type="text"
              name="comment"
              placeholder="Kommentar til konkurranse (valgfritt)"
              onChange={handleInputChange}
              value={contest.comment}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
            />
          </label>
        </div>

        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Legg til konkurranse
        </button>
      </form>
    </Page>
  )
}
