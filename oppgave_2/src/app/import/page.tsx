"use client"

import { useEffect, useState } from "react"

import { Page } from "@/components/PageTemplate"
import StatusMessage from "@/components/StatusMessage"

type ResponseData = {
  success: boolean
  error?: string
}

export default function NewQuestion() {
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [alreadyImported, setAlreadyimported] = useState<boolean | null>(null)

  useEffect(() => {
    const isImported = window.localStorage.getItem("imported") === "yes"
    setAlreadyimported(isImported)
  }, [alreadyImported])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const data = (await response.json()) as ResponseData
        switch (data.error) {
          case "Failed to fetch data from external API":
            setError("Kunne ikke hente data fra ekstern API.")
            break
          default:
            setError(
              "En ukjent feil har oppstått. Vennligst oppdater siden og prøv igjen.",
            )
            break
        }
      }

      setMessage("Utøvere importert.")
      window.localStorage.setItem("imported", "yes")
      setAlreadyimported(true)

      setError(null)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  return (
    <Page title="Importer utøvere" backButtonLocation="/">
      <form onSubmit={handleSubmit} className="space-y-4">
        <StatusMessage errorMessage={error} statusMessage={message} />

        {alreadyImported ? (
          <div
            className="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
            role="alert"
          >
            <strong className="font-bold">Status: </strong>
            <span className="block sm:inline">
              {" "}
              Utøvere er allerede importert. Dersom du importerer på nytt kan
              dette føre til duplikater.
            </span>
          </div>
        ) : (
          <div
            className="relative mb-4 rounded border border-indigo-400 bg-indigo-100 px-4 py-3 text-indigo-700"
            role="alert"
          >
            <strong className="font-bold">Status: </strong>
            <span className="block sm:inline">
              {" "}
              Utøvere er ikke blitt importert tidligere.
            </span>
          </div>
        )}

        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Importer utøvere
        </button>
      </form>
    </Page>
  )
}
