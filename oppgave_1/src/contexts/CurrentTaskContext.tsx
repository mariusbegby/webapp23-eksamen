import { createContext } from "react"

import { type Task } from "@/types"

type CurrentTaskContextType = {
  currentTask: Task | null
  tasks: Task[]
  isDone: boolean
  setIsDone: (done: boolean) => void // Add this line
}

export const CurrentTaskContext = createContext<CurrentTaskContextType>({
  currentTask: null,
  tasks: [],
  isDone: false,
  setIsDone: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
})
