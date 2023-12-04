"use client"

import { useEffect, useState } from "react"
import type { Activity, Question } from "@/types"
import { usePathname } from "next/navigation"

import { Page } from "@/components/PageTemplate"
import StatusMessage from "@/components/StatusMessage"

type ReportForm = {
  date: string
  status: "no" | "low" | "normal" | "high" | ""
  comment?: string
  ReportIntervals: ReportInterval[]
  ReportQuestions: ReportQuestion[]
}

type ReportInterval = {
  intervalId: string
  intensityMin: string
  intensityMax: string
  intensityAvg: string
  heartRateMin: string
  heartRateMax: string
  heartRateAvg: string
  speedMin: string
  speedMax: string
  speedAvg: string
  wattMin: string
  wattMax: string
  wattAvg: string
  duration: string
}

type ReportQuestion = {
  questionId: string
  question: string
  type: string
  answer: string
}

type ResponseDataNewReport = {
  success: boolean
  error?: string
  data?: JSON
}

type ResponseDataQuestions = {
  success: boolean
  data: Question[]
  error?: string
}

type ResponseDataActivity = {
  success: boolean
  error?: string
  data?: Activity
}

export default function NewReport() {
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [activity, setActivity] = useState<Activity | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])

  const pathname = usePathname()
  const pathParts = pathname.split("/")
  const id = pathParts[pathParts.length - 5]
  const activityId = pathParts[pathParts.length - 3]

  const [form, setForm] = useState<ReportForm>({
    date: activity?.date ?? new Date().toISOString().split("T")[0],
    status: "",
    ReportIntervals: [
      {
        intervalId: "",
        intensityMin: "",
        intensityMax: "",
        intensityAvg: "",
        heartRateMin: "",
        heartRateMax: "",
        heartRateAvg: "",
        speedMin: "",
        speedMax: "",
        speedAvg: "",
        wattMin: "",
        wattMax: "",
        wattAvg: "",
        duration: "",
      },
    ],
    ReportQuestions: [
      {
        questionId: "",
        question: "",
        type: "",
        answer: "",
      },
    ],
  })

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch("/api/questions")
      const data = (await response.json()) as ResponseDataQuestions

      if (data.success) {
        setQuestions(data.data)
      }
    }
    // eslint-disable-next-line no-console
    fetchQuestions().catch(console.error)
  }, [])

  useEffect(() => {
    const fetchActivity = async () => {
      const response = await fetch(
        `/api/athletes/${id}/activities/${activityId}`,
      )
      const data = (await response.json()) as ResponseDataActivity

      if (data.success && data.data) {
        setActivity(data.data)
        setForm({
          date: new Date().toISOString().split("T")[0],
          status: "",
          ReportIntervals: data.data.intervals.map((interval) => {
            return {
              intervalId: interval.id,
              intensityMin: "",
              intensityMax: "",
              intensityAvg: "",
              heartRateMin: "",
              heartRateMax: "",
              heartRateAvg: "",
              speedMin: "",
              speedMax: "",
              speedAvg: "",
              wattMin: "",
              wattMax: "",
              wattAvg: "",
              duration: "",
            }
          }),
          ReportQuestions: data.data.questions.map((question) => {
            return {
              questionId: question.id ?? "",
              question: question.question,
              type: question.type,
              answer: "",
            }
          }),
        })
      }
    }
    // eslint-disable-next-line no-console
    fetchActivity().catch(console.error)
  }, [id, activityId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  const handleIntervalChange = (
    e: React.FormEvent<HTMLInputElement>,
    index: number,
  ) => {
    const updatedIntervals = [...form.ReportIntervals]
    const target = e.target as HTMLInputElement
    if (target.name in updatedIntervals[index]) {
      updatedIntervals[index][target.name as keyof ReportInterval] =
        target.value
    }
    setForm({ ...form, ReportIntervals: updatedIntervals })
  }

  const handleQuestionChange = (
    e: React.FormEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
  ) => {
    const updatedQuestions = [...form.ReportQuestions]
    const target = e.target as HTMLInputElement | HTMLSelectElement
    updatedQuestions[index].answer = target.value
    setForm({ ...form, ReportQuestions: updatedQuestions })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const response = await fetch(
      `/api/athletes/${id}/activities/${activityId}/reports`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      },
    )

    if (response.ok) {
      setError(null)
      setMessage("Rapport ble opprettet!")
      setForm({
        date: new Date().toISOString().split("T")[0],
        status: "",
        ReportIntervals: [],
        ReportQuestions: [],
      })
    } else {
      const data = (await response.json()) as ResponseDataNewReport

      if (data.error) {
        setMessage(null)
        switch (data.error) {
          case "date, status, ReportIntervals and ReportQuestions are required":
            setError("Alle feltene utenom kommentar må fylles ut")
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
    <Page title="Opprett rapport" backButtonLocation={`/athletes/${id}`}>
      <form onSubmit={handleSubmit}>
        <StatusMessage errorMessage={error} statusMessage={message} />

        <fieldset className="mb-8 space-y-4">
          <legend className="text-lg font-bold text-gray-900 dark:text-gray-200">
            Generell informasjon
          </legend>

          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200">
              Dato:
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
              />
            </label>
          </div>

          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200">
              Status:
              <select
                value={form.status}
                name="status"
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Velg status</option>
                <option value="no">Økt ikke gjennomført</option>
                <option value="low">Gjennomført med dårlig kvalitet</option>
                <option value="normal">Gjennomført som forventet</option>
                <option value="high">Gjennombruddsøkt</option>
              </select>
            </label>
          </div>

          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200">
              Kommentar:
              <input
                type="text"
                name="comment"
                placeholder="Kommentar til rapporten"
                value={form.comment}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="mb-8 space-y-4">
          <legend className="text-lg font-bold text-gray-900 dark:text-gray-200">
            Intervaller
          </legend>

          {form.ReportIntervals.map((interval, index) => (
            <div key={index} className="space-y-4">
              <div className="mt-8">
                <label className="block font-medium text-gray-700 dark:text-gray-200">
                  Intervall {index + 1} tid:
                  <input
                    type="number"
                    name="duration"
                    placeholder="Tid"
                    value={interval.duration}
                    onChange={(e) => {
                      handleIntervalChange(e, index)
                    }}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                  />
                </label>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block font-medium text-gray-700 dark:text-gray-200">
                    Intervall {index + 1} opplevd intensitet (min):
                    <input
                      type="number"
                      name="intensityMin"
                      placeholder="Min"
                      value={interval.intensityMin}
                      onChange={(e) => {
                        handleIntervalChange(e, index)
                      }}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <label className="block font-medium text-gray-700 dark:text-gray-200">
                    Intervall {index + 1} opplevd intensitet (max):
                    <input
                      type="number"
                      name="intensityMax"
                      placeholder="Maks"
                      value={interval.intensityMax}
                      onChange={(e) => {
                        handleIntervalChange(e, index)
                      }}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <label className="block font-medium text-gray-700 dark:text-gray-200">
                    Intervall {index + 1} opplevd intensitet (avg):
                    <input
                      type="number"
                      name="intensityAvg"
                      placeholder="Snitt"
                      value={interval.intensityAvg}
                      onChange={(e) => {
                        handleIntervalChange(e, index)
                      }}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                    />
                  </label>
                </div>
              </div>

              {activity?.metricOptions.heartrate && (
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block font-medium text-gray-700 dark:text-gray-200">
                      Intervall {index + 1} hjerterytme (min):
                      <input
                        type="number"
                        name="heartRateMin"
                        placeholder="Min"
                        value={interval.heartRateMin}
                        onChange={(e) => {
                          handleIntervalChange(e, index)
                        }}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium text-gray-700 dark:text-gray-200">
                      Intervall {index + 1} hjerterytme (max):
                      <input
                        type="number"
                        name="heartRateMax"
                        placeholder="Maks"
                        value={interval.heartRateMax}
                        onChange={(e) => {
                          handleIntervalChange(e, index)
                        }}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium text-gray-700 dark:text-gray-200">
                      Intervall {index + 1} hjerterytme (avg):
                      <input
                        type="number"
                        name="heartRateAvg"
                        placeholder="Snitt"
                        value={interval.heartRateAvg}
                        onChange={(e) => {
                          handleIntervalChange(e, index)
                        }}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                      />
                    </label>
                  </div>
                </div>
              )}

              {activity?.metricOptions.speed && (
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block font-medium text-gray-700 dark:text-gray-200">
                      Intervall {index + 1} fart (min):
                      <input
                        type="number"
                        name="speedMin"
                        placeholder="Min"
                        value={interval.speedMin}
                        onChange={(e) => {
                          handleIntervalChange(e, index)
                        }}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium text-gray-700 dark:text-gray-200">
                      Intervall {index + 1} fart (max):
                      <input
                        type="number"
                        name="speedMax"
                        placeholder="Maks"
                        value={interval.speedMax}
                        onChange={(e) => {
                          handleIntervalChange(e, index)
                        }}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium text-gray-700 dark:text-gray-200">
                      Intervall {index + 1} fart (avg):
                      <input
                        type="number"
                        name="speedAvg"
                        placeholder="Snitt"
                        value={interval.speedAvg}
                        onChange={(e) => {
                          handleIntervalChange(e, index)
                        }}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                      />
                    </label>
                  </div>
                </div>
              )}

              {activity?.metricOptions.watt && (
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block font-medium text-gray-700 dark:text-gray-200">
                      Intervall {index + 1} watt (min):
                      <input
                        type="number"
                        name="wattMin"
                        placeholder="Min"
                        value={interval.wattMin}
                        onChange={(e) => {
                          handleIntervalChange(e, index)
                        }}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium text-gray-700 dark:text-gray-200">
                      Intervall {index + 1} watt (max):
                      <input
                        type="number"
                        name="wattMax"
                        placeholder="Maks"
                        value={interval.wattMax}
                        onChange={(e) => {
                          handleIntervalChange(e, index)
                        }}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium text-gray-700 dark:text-gray-200">
                      Intervall {index + 1} watt (avg):
                      <input
                        type="number"
                        name="wattAvg"
                        placeholder="Snitt"
                        value={interval.wattAvg}
                        onChange={(e) => {
                          handleIntervalChange(e, index)
                        }}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))}
        </fieldset>

        <fieldset className="mb-8 space-y-4">
          <legend className="text-lg font-bold text-gray-900 dark:text-gray-200">
            Spørsmål
          </legend>

          {form.ReportQuestions.map((question, index) => (
            <div key={index} className="space-y-4">
              <label className="block font-medium text-gray-700 dark:text-gray-200">
                Spørsmål {index + 1}: {questions[index]?.question}
                {question.type === "text" && (
                  <input
                    type="text"
                    name={`question-${index}`}
                    placeholder="Skriv ditt svar her"
                    value={question.answer}
                    onChange={(e) => {
                      handleQuestionChange(e, index)
                    }}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                  />
                )}
                {question.type === "radio" && (
                  <div className="mt-1 flex gap-8">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <label key={num}>
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={num}
                          checked={question.answer === num.toString()}
                          onChange={(e) => {
                            handleQuestionChange(e, index)
                          }}
                        />{" "}
                        {num}
                      </label>
                    ))}
                  </div>
                )}
                {question.type === "radio:emoji" && (
                  <div className="mt-1 flex gap-8">
                    {["☹️", "🙂", "😁"].map((emoji, i) => (
                      <label key={i}>
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={emoji}
                          checked={question.answer === emoji}
                          onChange={(e) => {
                            handleQuestionChange(e, index)
                          }}
                        />{" "}
                        {emoji}
                      </label>
                    ))}
                  </div>
                )}
              </label>
            </div>
          ))}
        </fieldset>

        <button
          type="submit"
          className="mt-2 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Opprett rapport
        </button>
      </form>
    </Page>
  )
}
