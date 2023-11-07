"use client"

import useProgress from "@/hooks/useProgress"
import { type Task } from "@/types"

type ProgressProps = {
  tasks: Task[]
}

export default function Progress({ tasks }: ProgressProps) {
  const { count, current, next, prev } = useProgress({ tasks })
  const lastPosition = tasks.length

  return (
    <footer className="mt-4 border-t-slate-300">
      <p>
        Posisjon: {count + 1} / {lastPosition}.
      </p>
      <p>{current.id}</p>
      <button onClick={prev} className="bg-purple-700 text-white">
        Forrige
      </button>
      <button onClick={next} className="bg-teal-700 text-white">
        Neste
      </button>
    </footer>
  )
}
