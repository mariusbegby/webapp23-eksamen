"use client"

import { useState } from "react"
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

export default function NewActivity() {
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

  const handleNumIntervalsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumIntervals = parseInt(e.target.value, 10)
    setNumIntervals(newNumIntervals)
    setForm((prevForm) => {
      if (newNumIntervals > prevForm.intervals.length) {
        return {
          ...prevForm,
          intervals: [
            ...prevForm.intervals,
            ...Array(newNumIntervals - prevForm.intervals.length).fill({
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
    })
  }

  const handleNumQuestionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumQuestions = parseInt(e.target.value, 10)
    setNumQuestions(newNumQuestions)
    setForm((prevForm) => {
      if (newNumQuestions > prevForm.questions.length) {
        return {
          ...prevForm,
          questions: [
            ...prevForm.questions,
            ...Array(newNumQuestions - prevForm.questions.length).fill(""),
          ],
        }
      } else {
        return {
          ...prevForm,
          questions: prevForm.questions.slice(0, newNumQuestions),
        }
      }
    })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
    isInterval?: boolean,
    isIntensity?: boolean,
  ) => {
    if (isInterval) {
      const newIntervals = [...form.intervals]
      if (isIntensity) {
        newIntervals[index!].intensity = e.target.value
      } else {
        newIntervals[index!].duration = e.target.value
      }
      setForm((prevForm) => ({
        ...prevForm,
        intervals: newIntervals,
      }))
    } else if (index !== undefined) {
      const newQuestions = [...form.questions]
      newQuestions[index] = e.target.value
      setForm((prevForm) => ({
        ...prevForm,
        questions: newQuestions,
      }))
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [e.target.name]: e.target.value,
      }))
    }
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
                onChange={handleChange}
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
                value={form.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200">
              Tags (separer med komma):
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200">
              Type aktivitet:
              <input
                type="text"
                name="type"
                value={form.type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
              />
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
              type="number"
              min="1"
              value={numQuestions}
              onChange={handleNumQuestionsChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
            />
          </label>
          {form.questions.map((question, index) => (
            <div key={index}>
              <label className="block font-medium text-gray-700 dark:text-gray-200">
                Spørsmål {index + 1}:
                <input
                  type="text"
                  value={question}
                  onChange={(e) => {
                    handleChange(e, index)
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                />
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
              type="number"
              min="1"
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
                    onChange={(e) => {
                      handleChange(e, index, true)
                    }}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                  />
                </label>
              </div>
              <div className="flex-1">
                <label className="block font-medium text-gray-700 dark:text-gray-200">
                  Intervall {index + 1} Intensitet:
                  <input
                    type="text"
                    value={interval.intensity}
                    onChange={(e) => {
                      handleChange(e, index, true, true)
                    }}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
                  />
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
