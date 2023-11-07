import { type ReactNode } from "react"

import { type Task } from "@/types"

type TasksProps = {
  children: ReactNode
  task: Task
}

export default function Tasks({ children, task }: TasksProps) {
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
