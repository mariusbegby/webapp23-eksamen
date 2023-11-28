"use client"

import { useEffect, useState } from "react"

import Answer from "@/components/Answer"
import Header from "@/components/Header"
import Progress from "@/components/Progress"
import Tasks from "@/components/Tasks"
import TaskText from "@/components/Text"
import { CurrentTaskContext } from "@/contexts/CurrentTaskContext"
import { calculateAnswer } from "@/lib/utils"
import { type Task } from "@/types"

type ApiResponse = {
  success: boolean
  data: Task[]
}

type Answer = {
  id: string
  attempts: number
  correct: boolean
  type: Task["type"]
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [isDone, setIsDone] = useState(false)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [totalScore, setTotalScore] = useState(0)

  const currentIndex = currentTask && tasks.indexOf(currentTask)
  const isLastTask = currentIndex === tasks.length - 1
  const nextTask = currentIndex && tasks[currentIndex + 1]
  const showResults = isLastTask && isDone && !nextTask

  const submitAnswer = (id: string, answer: number) => {
    const task = tasks.find((task) => task.id === id)
    if (!task) {
      return
    }

    const correctAnswer = calculateAnswer(task)
    const correct = answer === correctAnswer
    const existingAnswer = answers.find((a) => a.id === id)

    if (existingAnswer) {
      setAnswers((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, attempts: a.attempts + 1, correct } : a,
        ),
      )
    } else {
      setAnswers((prev) => [
        ...prev,
        { id, attempts: 1, correct, type: task.type },
      ])
    }
  }

  useEffect(() => {
    const newTotalScore = answers.reduce(
      (score, answer) => score + (answer.correct ? 1 : 0),
      0,
    )
    setTotalScore(newTotalScore)
  }, [answers])

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch(
        "http://localhost:3000/api/restapi?count=5",
        {
          method: "get",
        },
      )
      const result = (await response.json()) as ApiResponse

      if (result.success) {
        setTasks(result.data)
        setCurrentTask(result.data[0])
      }
    }

    fetchTasks().catch((error) => {
      throw error
    })
  }, [])

  if (tasks.length === 0) {
    return <div>Loading...</div>
  }

  const restart = () => {
    setIsDone(false)
    // TODO: get new tasks

    setCurrentTask(tasks[0])
  }

  return (
    <main>
      <Header />
      <CurrentTaskContext.Provider
        value={{ currentTask, tasks, isDone, setIsDone, submitAnswer }}
      >
        {showResults ? (
          <>
            <div id="results">
              <h2>Resultater</h2>
              <b>Din poengsum:</b>
              <p>
                {totalScore} av {tasks.length} mulige
              </p>
              <br></br>
              <b>Du trenger å øve mer på:</b>
              <ul>
                {answers.filter((answer) => !answer.correct).length > 0 ? (
                  (() => {
                    const incorrectByType = answers.reduce<
                      Record<string, number>
                    >((acc, answer) => {
                      if (!answer.correct) {
                        acc[answer.type] = (acc[answer.type] || 0) + 1
                      }
                      return acc
                    }, {})

                    const typeToPractice = Object.keys(incorrectByType).reduce(
                      (a, b) =>
                        incorrectByType[a] > incorrectByType[b] ? a : b,
                    )

                    return <p>{typeToPractice}</p>
                  })()
                ) : (
                  <p>Ingenting! Du greide alle oppgavene :)</p>
                )}
              </ul>
              <br></br>
              <button
                onClick={restart}
                className="button bg-purple-700  text-white"
              >
                Start på nytt
              </button>
            </div>
          </>
        ) : (
          <>
            <Tasks task={currentTask}>
              <Answer />
            </Tasks>
            <TaskText text={"Hva blir resultatet av regneoperasjonen?"} />
            <Progress
              tasks={tasks}
              current={currentTask}
              setCurrent={setCurrentTask}
            />
          </>
        )}
      </CurrentTaskContext.Provider>
    </main>
  )
}
