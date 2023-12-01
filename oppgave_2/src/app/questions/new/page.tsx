"use client"

import { useState } from "react"
import type { Question } from "@prisma/client"

import { Page } from "@/components/PageTemplate"

type QuestionForm = {
  question: string
  type: string
}

type ResponseData = {
  success: boolean
  error?: string
  data?: Question
}

export default function NewQuestion() {
  const [form, setForm] = useState<QuestionForm>({
    question: "",
    type: "",
  })

  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!form.question || !form.type) {
      setError("Feltene for spørsmålstekst og type må fylles ut.")
      setMessage(null)
      return
    }

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const data = (await response.json()) as ResponseData
        switch (data.error) {
          case "Question text and type is required":
            setError("Feltene for spørsmålstekst og type må fylles ut.")
            break
          default:
            setError(
              "En ukjent feil har oppstått. Vennligst oppdater siden og prøv igjen.",
            )
            break
        }
      }

      setMessage("Spørsmål opprettet!")

      setError(null)
      setForm({
        question: "",
        type: "",
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Page title="Opprett spørsmål" backButtonLocation="/">
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
            Spørsmålstekst:
            <input
              type="text"
              name="question"
              value={form.question}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
            />
          </label>
        </div>
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Type:
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Velg type</option>
              <option value="text">Tekst</option>
              <option value="radio">Skala 1-10</option>
              <option value="radio:emoji">☹️ / 🙂 / 😁 (emoji)</option>
            </select>
          </label>
        </div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Opprett spørsmål
        </button>
      </form>
    </Page>
  )
}
