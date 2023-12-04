"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"

import { Page } from "@/components/PageTemplate"
import StatusMessage from "@/components/StatusMessage"

type ResponseData = {
  success: boolean
  data: JSON
  error?: string
}

type TrainingGoal = {
  name: string
  date: string
  goal: number
  comment: string
}

export default function NewTrainingGoal() {
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [trainingGoal, setTrainingGoal] = useState<TrainingGoal>({
    name: "",
    date: new Date().toISOString().split("T")[0],
    goal: 0,
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

    const response = await fetch(`/api/athletes/${id}/goals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trainingGoal),
    })

    if (response.ok) {
      setTrainingGoal({
        name: "",
        date: new Date().toISOString().split("T")[0],
        goal: 0,
        comment: "",
      })
      setError(null)
      setMessage("Treningsmålet ble opprettet!")
    } else {
      const data = (await response.json()) as ResponseData

      if (data.error) {
        setMessage(null)
        switch (data.error) {
          case "Name, date and goal is required":
            setError("Feltene for navn, dato og mål må fylles ut.")
            break
          case "An athlete cannot have more than three training goals in a given year":
            setError(
              "En utøver kan ikke ha mer enn tre treningsmål i samme år.",
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
    <Page title="Legg til treningsmål" backButtonLocation={`/athletes/${id}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <StatusMessage errorMessage={error} statusMessage={message} />

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
            Mål:
            <input
              type="number"
              name="goal"
              placeholder="Verdi som skal oppnås"
              onChange={handleInputChange}
              value={trainingGoal.goal}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
            />
          </label>
        </div>
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Kommentar:
            <input
              type="text"
              name="comment"
              placeholder="Kommentar til treningsmålet (valgfritt)"
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
