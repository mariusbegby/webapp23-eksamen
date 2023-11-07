"use client"

import { useEffect, useState } from "react"

import Answer from "@/components/Answer"
import Header from "@/components/Header"
import Progress from "@/components/Progress"
import Tasks from "@/components/Tasks"
import TaskText from "@/components/Text"
import { CurrentTaskContext } from "@/contexts/CurrentTaskContext"
import useProgress from "@/hooks/useProgress"
import { type Task } from "@/types"

type ApiResponse = {
  success: boolean
  data: Task[]
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentTask, setCurrentTask] = useState<Task | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch(
        "http://localhost:3000/api/restapi?count=5",
        {
          method: "get",
        },
      )
      const result = (await response.json()) as ApiResponse

      if (result.success) {
        setTasks(result.data)
        setCurrentTask(result.data[0])
      }
    }

    fetchTasks().catch((error) => {
      throw error
    })
  }, [])

  if (tasks.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <main>
      <Header />
      <CurrentTaskContext.Provider value={currentTask}>
        <Tasks task={currentTask}>
          <Answer />
        </Tasks>
        <TaskText text={"Hva blir resultatet av regneoperasjonen?"} />
        <Progress
          tasks={tasks}
          current={currentTask}
          setCurrent={setCurrentTask}
        />
      </CurrentTaskContext.Provider>
    </main>
  )
}
