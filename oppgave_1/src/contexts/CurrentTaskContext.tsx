import { createContext } from "react"

import { type Task } from "@/types"

type CurrentTaskContextType = {
  currentTask: Task | null
  tasks: Task[]
  isDone: boolean
  setIsDone: (done: boolean) => void
  submitAnswer: (id: string, answer: number) => void
}

export const CurrentTaskContext = createContext<CurrentTaskContextType>({
  currentTask: null,
  tasks: [],
  isDone: false,
  setIsDone: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  submitAnswer: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
})
