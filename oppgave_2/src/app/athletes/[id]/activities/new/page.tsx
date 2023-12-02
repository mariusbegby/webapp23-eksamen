"use client"

import { useEffect, useState } from "react"
import type { Question, Sport } from "@/types"
import { usePathname } from "next/navigation"

import { Page } from "@/components/PageTemplate"

type Interval = {
  duration: string
  zone: string
}

type MetricOptions = {
  heartrate: boolean
  watt: boolean
  speed: boolean
}

type ActivityForm = {
  date: string
  name: string
  tags: string
  sport: Sport
  metricOptions: MetricOptions
  questionIds: string[]
  intervals: Interval[]
}

type ResponseDataNewActivity = {
  success: boolean
  error?: string
  data?: JSON
}

type ResponseDataQuestions = {
  success: boolean
  data: Question[]
  error?: string
}

export default function NewActivity() {
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [questions, setQuestions] = useState<Question[]>([])

  const pathname = usePathname()
  const pathParts = pathname.split("/")
  const id = pathParts[pathParts.length - 3]

  const [numIntervals, setNumIntervals] = useState(1)
  const [numQuestions, setNumQuestions] = useState(1)

  const [form, setForm] = useState<ActivityForm>({
    date: new Date().toISOString().split("T")[0],
    name: "",
    tags: "",
    sport: "",
    questionIds: [],
    metricOptions: {
      heartrate: false,
      watt: false,
      speed: false,
    },
    intervals: [
      {
        duration: "",
        zone: "1",
      },
    ],
  })

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target
    setForm((prevForm) => ({
      ...prevForm,
      metricOptions: {
        ...prevForm.metricOptions,
        [id]: checked,
      },
    }))
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch("/api/questions")
      const data = (await response.json()) as ResponseDataQuestions

      if (data.success) {
        setQuestions(data.data)
        // Update form state with first question as default
        setForm((prevForm) => ({
          ...prevForm,
          questionIds: [data.data[0].id],
        }))
      } else {
        console.error(data.error)
      }
    }

    fetchQuestions().catch(console.error)
  }, [])

  const handleNumQuestionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (value === "") {
      value = "0"
    } else {
      let numValue = parseInt(value)
      numValue = numValue > 10 ? 10 : numValue
      value = numValue.toString()
    }
    setNumQuestions(parseInt(value))
    setForm((prevForm) => updateQuestions(prevForm, parseInt(value)))
  }

  const handleNumIntervalsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newNumIntervals = parseInt(e.target.value, 10)
    if (isNaN(newNumIntervals)) {
      newNumIntervals = 0
    } else if (newNumIntervals > 10) {
      newNumIntervals = 10
    }
    setNumIntervals(newNumIntervals)
    setForm((prevForm) => updateIntervals(prevForm, newNumIntervals))
  }

  const updateIntervals = (
    prevForm: ActivityForm,
    newNumIntervals: number,
  ): ActivityForm => {
    if (newNumIntervals > prevForm.intervals.length) {
      return {
        ...prevForm,
        intervals: [
          ...prevForm.intervals,
          ...Array<Interval>(newNumIntervals - prevForm.intervals.length).fill({
            duration: "",
            zone: "1",
          }),
        ],
      }
    } else {
      return {
        ...prevForm,
        intervals: prevForm.intervals.slice(0, newNumIntervals),
      }
    }
  }

  const updateQuestions = (
    prevForm: ActivityForm,
    newNumQuestions: number,
  ): ActivityForm => {
    if (newNumQuestions > prevForm.questionIds.length) {
      return {
        ...prevForm,
        questionIds: [
          ...prevForm.questionIds,
          ...Array<string>(newNumQuestions - prevForm.questionIds.length).fill(
            "",
          ),
        ],
      }
    } else {
      return {
        ...prevForm,
        questionIds: prevForm.questionIds.slice(0, newNumQuestions),
      }
    }
  }

  const handleGeneralInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  const handleQuestionChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number,
  ) => {
    const newQuestions = [...form.questionIds]
    newQuestions[index] = e.target.value
    setForm((prevForm) => ({ ...prevForm, questionIds: newQuestions }))
  }

  const handleIntervalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
    field: keyof Interval,
  ) => {
    const newIntervals = [...form.intervals]
    newIntervals[index] = {
      ...newIntervals[index],
      [field]: e.target.value,
    }
    setForm((prevForm) => ({ ...prevForm, intervals: newIntervals }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(form)

    const response = await fetch(`/api/athletes/${id}/activities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })

    if (response.ok) {
      setError(null)
      setMessage("Økten ble opprettet!")
      const responseData = (await response.json()) as ResponseDataNewActivity
      console.log(responseData)
    } else {
      const data = (await response.json()) as ResponseDataNewActivity

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
    <Page title="Opprett treningsøkt" backButtonLocation={`/athletes/${id}`}>
      <form onSubmit={handleSubmit}>
        {error && (
          <div
            className="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
            role="alert"
          >
            <strong className="font-bold">Feilmelding: </strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {message && (
          <div
            className="relative mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700"
            role="alert"
          >
            <strong className="font-bold">Status: </strong>
            <span className="block sm:inline"> {message}</span>
          </div>
        )}

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
                onChange={handleGeneralInfoChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200">
              Navn:
              <input
                type="text"
                name="name"
                placeholder="Navn på økt"
                value={form.name}
                onChange={handleGeneralInfoChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200">
              Tagger (separer med komma):
              <input
                type="text"
                name="tags"
                placeholder="Tagger for økten"
                value={form.tags}
                onChange={handleGeneralInfoChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200">
              Type aktivitet:
              <select
                name="sport"
                value={form.sport}
                onChange={handleGeneralInfoChange}
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
        </fieldset>

        <fieldset className="mb-8 space-y-4">
          <legend className="text-lg font-bold text-gray-900 dark:text-gray-200">
            Spørsmål
          </legend>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Antall spørsmål:
            <input
              type="text"
              min="1"
              max="10"
              value={numQuestions}
              onChange={handleNumQuestionsChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
            />
          </label>
          {form.questionIds.map((questionId, index) => (
            <div key={index}>
              <label className="block font-medium text-gray-700 dark:text-gray-200">
                Spørsmål {index + 1}:
                <select
                  value={questionId}
                  onChange={(e) => {
                    handleQuestionChange(e, index)
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                >
                  {questions.map((question) => (
                    <option key={question.id} value={question.id}>
                      {question.question} (
                      {question.type === "radio"
                        ? "Skala 1-10"
                        : question.type === "radio:emoji"
                        ? "☹️ / 🙂 / 😁"
                        : "Tekst"}
                      )
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ))}
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-lg font-bold text-gray-900 dark:text-gray-200">
            Intervaller
          </legend>

          <div>
            <h3 className="block font-medium text-gray-700 dark:text-gray-200">
              Velg måleparametere:
            </h3>
            <div className="mt-2 flex space-x-4">
              <div>
                <input
                  type="checkbox"
                  id="heartrate"
                  value="heartrate"
                  onChange={handleOptionChange}
                  className="rounded"
                />
                <label
                  htmlFor="heartrate"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Hjertefrekvens
                </label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="watt"
                  value="watt"
                  onChange={handleOptionChange}
                  className="rounded"
                />
                <label
                  htmlFor="watt"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Watt
                </label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="speed"
                  value="speed"
                  onChange={handleOptionChange}
                  className="rounded"
                />
                <label
                  htmlFor="speed"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Fart
                </label>
              </div>
            </div>
          </div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Antall intervaller:
            <input
              type="text"
              min="1"
              max="10"
              value={numIntervals}
              onChange={handleNumIntervalsChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
            />
          </label>
          {form.intervals.map((interval, index) => (
            <div key={index} className="flex space-x-4">
              <div className="flex-1">
                <label className="block font-medium text-gray-700 dark:text-gray-200">
                  Intervall {index + 1} varighet:
                  <input
                    type="text"
                    value={interval.duration}
                    placeholder="Varighet i minutter"
                    onChange={(e) => {
                      handleIntervalChange(e, index, "duration")
                    }}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                  />
                </label>
              </div>
              <div className="flex-1">
                <label className="block font-medium text-gray-700 dark:text-gray-200">
                  Intervall {index + 1} intensitetssone:
                  <select
                    value={interval.zone}
                    onChange={(e) => {
                      handleIntervalChange(e, index, "zone")
                    }}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="1">Sone 1</option>
                    <option value="2">Sone 2</option>
                    <option value="3">Sone 3</option>
                    <option value="4">Sone 4</option>
                    <option value="5">Sone 5</option>
                  </select>
                </label>
              </div>
            </div>
          ))}
        </fieldset>
        <button
          type="submit"
          className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Opprett økt
        </button>
      </form>
    </Page>
  )
}
