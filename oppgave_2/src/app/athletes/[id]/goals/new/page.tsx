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

type TrainingGoal = {
  name: string
  date: string
  location: string
  goal: string
  sport: Sport
  priority: Priority
  comment: string
}

export default function NewTrainingGoal() {
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [trainingGoal, setTrainingGoal] = useState<TrainingGoal>({
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
    setTrainingGoal((prevTrainingGoal) => ({
      ...prevTrainingGoal,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(trainingGoal)

    const response = await fetch(`/api/athletes/${id}/goals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trainingGoal),
    })

    if (response.ok) {
      setError(null)
      setMessage("Økten ble opprettet!")
      const responseData = (await response.json()) as ResponseData
      console.log(responseData)
    } else {
      const data = (await response.json()) as ResponseData

      if (data.error) {
        setMessage(null)
        switch (data.error) {
          case "Bla bla bla":
            setError("Bla bla bla")
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
    <Page title="Legg til treningsmål" backButtonLocation={`/athletes/${id}`}>
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
              placeholder="Navn på treningsmål"
              onChange={handleInputChange}
              value={trainingGoal.name}
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
              value={trainingGoal.date}
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
              placeholder="Lokasjon for treningsmål"
              onChange={handleInputChange}
              value={trainingGoal.location}
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
              placeholder="Beskriv treningsmålet"
              onChange={handleInputChange}
              value={trainingGoal.goal}
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
              value={trainingGoal.sport}
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
              value={trainingGoal.priority}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Velg prioritet</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </label>
        </div>
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Kommentar:
            <input
              type="text"
              name="comment"
              placeholder="Kommentar til treningsmål (valgfritt)"
              onChange={handleInputChange}
              value={trainingGoal.comment}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
            />
          </label>
        </div>

        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Legg til treningsmål
        </button>
      </form>
    </Page>
  )
}
