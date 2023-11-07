import { type ReactNode } from "react"

import { type Task } from "@/types"

type TasksProps = {
  children: ReactNode
  tasks: Task[]
}

export default function Tasks({ children, tasks }: TasksProps) {
  return (
    <section>
      {tasks.map((task) => (
        <article key={task.id}>
          <p>{task.type}</p>
          <h3>{task.text}</h3>
          <p>{task.data}</p>
        </article>
      ))}
      {children}
    </section>
  )
}
