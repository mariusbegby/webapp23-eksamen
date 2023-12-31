import { type ReactNode } from "react"

import { type Task } from "@/types"

type TasksProps = {
  children: ReactNode
  task: Task | null
}

export default function Tasks({ children, task }: TasksProps) {
  if (!task) {
    return null
  }

  return (
    <section>
      <article>
        <p>{task.type}</p>
        <h3>{task.text}</h3>
        <p>{task.data}</p>
      </article>
      {children}
    </section>
  )
}
