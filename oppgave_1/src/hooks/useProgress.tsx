import { useState } from "react"

import { type Task } from "@/types"

export default function useProgress({ tasks }: { tasks: Task[] }) {
  const [count, setCount] = useState(0)
  const current = tasks[count]

  const next = () => {
    if (count < tasks.length - 1) {
      setCount(count + 1)
    }
  }

  const prev = () => {
    if (count > 0) {
      setCount(count - 1)
    }
  }

  return { count, current, next, prev }
}
