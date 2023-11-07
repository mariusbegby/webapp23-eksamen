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
  const { current } = useProgress({ tasks })

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
      <CurrentTaskContext.Provider value={current}>
        <Tasks tasks={tasks}>
          <Answer />
        </Tasks>
        <TaskText text={"Hva blir resultatet av regneoperasjonen?"} />
        <Progress tasks={tasks} />
      </CurrentTaskContext.Provider>
    </main>
  )
}
