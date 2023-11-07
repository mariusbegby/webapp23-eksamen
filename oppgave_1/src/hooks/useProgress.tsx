import { useContext } from "react"

import { CurrentTaskContext } from "@/contexts/CurrentTaskContext"
import { type Task } from "@/types"

export default function useProgress({
  tasks,
  current,
  setCurrent,
}: {
  tasks: Task[]
  current: Task | null
  setCurrent: (task: Task | null) => void
}) {
  const { setIsDone } = useContext(CurrentTaskContext)

  const clear = () => {
    const feedback = document.getElementById("feedback")
    if (feedback) {
      feedback.textContent = ""
    }

    const attempts = document.getElementById("attempts")
    if (attempts) {
      attempts.textContent = "0 av 3 forsøk"
    }
  }
  const next = () => {
    if (current) {
      const currentIndex = tasks.indexOf(current)
      if (currentIndex < tasks.length - 1) {
        setCurrent(tasks[currentIndex + 1])
        setIsDone(false)
        clear()
      }
    }
  }

  const prev = () => {
    if (current) {
      const currentIndex = tasks.indexOf(current)
      if (currentIndex > 0) {
        setCurrent(tasks[currentIndex - 1])
        clear()
      }
    }
  }

  return { current, next, prev }
}
