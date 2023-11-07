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
  const next = () => {
    if (current) {
      const currentIndex = tasks.indexOf(current)
      if (currentIndex < tasks.length - 1) {
        setCurrent(tasks[currentIndex + 1])
      }
    }
  }

  const prev = () => {
    if (current) {
      const currentIndex = tasks.indexOf(current)
      if (currentIndex > 0) {
        setCurrent(tasks[currentIndex - 1])
      }
    }
  }

  return { current, next, prev }
}
