import useProgress from "@/hooks/useProgress"
import { type Task } from "@/types"

type ProgressProps = {
  tasks: Task[]
  current: Task | null
  setCurrent: (task: Task | null) => void
}

export default function Progress({
  tasks,
  current,
  setCurrent,
}: ProgressProps) {
  const { next, prev } = useProgress({ tasks, current, setCurrent })

  return (
    <footer className="mt-4 border-t-slate-300">
      <div style={{ display: "none" }}>{current?.id}</div>
      <button onClick={prev} className="button bg-purple-700  text-white">
        Forrige
      </button>
      <button onClick={next} className="button bg-teal-700 text-white">
        Neste
      </button>
    </footer>
  )
}
