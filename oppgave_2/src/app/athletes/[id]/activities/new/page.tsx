"use client"

import { useEffect, useState } from "react"
import type { Question } from "@/types"
import { usePathname } from "next/navigation"

import { Page } from "@/components/PageTemplate"

type Interval = {
  duration: string
  intensity: string
}

type ActivityForm = {
  date: string
  name: string
  tags: string
  type: string
  questions: string[]
  intervals: Interval[]
}

type ResponseData = {
  success: boolean
  data: Question[]
  error?: string
}

export default function NewActivity() {
  const [questions, setQuestions] = useState<Question[]>([])

  const pathname = usePathname()
  const pathParts = pathname.split("/")
  const id = pathParts[pathParts.length - 3]

  const [form, setForm] = useState<ActivityForm>({
    date: new Date().toISOString().split("T")[0],
    name: "",
    tags: "",
    type: "",
    questions: [""],
    intervals: [{ duration: "", intensity: "" }],
  })

  const [numIntervals, setNumIntervals] = useState(1)
  const [numQuestions, setNumQuestions] = useState(1)

  useEffect(() => {
    const fetchQuestsions = async () => {
      const response = await fetch("/api/questions")
      const data = (await response.json()) as ResponseData

      if (data.success) {
        setQuestions(data.data)
      } else {
        console.error(data.error)
      }
    }

    fetchQuestsions().catch(console.error)
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
            intensity: "",
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
    if (newNumQuestions > prevForm.questions.length) {
      return {
        ...prevForm,
        questions: [
          ...prevForm.questions,
          ...Array<string>(newNumQuestions - prevForm.questions.length).fill(
            "",
          ),
        ],
      }
    } else {
      return {
        ...prevForm,
        questions: prevForm.questions.slice(0, newNumQuestions),
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
    const newQuestions = [...form.questions]
    newQuestions[index] = e.target.value
    setForm((prevForm) => ({ ...prevForm, questions: newQuestions }))
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
    // TODO: Send form data to server
  }

  return (
    <Page title="Opprett treningsøkt" backButtonLocation={`/athletes/${id}`}>
      <form onSubmit={handleSubmit}>
        <fieldset className="mb-8 space-y-4">
          <legend className="text-lg font-medium text-gray-900 dark:text-gray-200">
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
                name="type"
                value={form.type}
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
          <legend className="text-lg font-medium text-gray-900 dark:text-gray-200">
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
          {form.questions.map((questionId, index) => (
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
          <legend className="text-lg font-medium text-gray-900 dark:text-gray-200">
            Intervaller
          </legend>
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
                  Intervall {index + 1} Varighet:
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
                  Intervall {index + 1} Intensitet:
                  <select
                    value={interval.intensity}
                    onChange={(e) => {
                      handleIntervalChange(e, index, "intensity")
                    }}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="50">50%</option>
                    <option value="60">60%</option>
                    <option value="70">70%</option>
                    <option value="80">80%</option>
                    <option value="90">90%</option>
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
