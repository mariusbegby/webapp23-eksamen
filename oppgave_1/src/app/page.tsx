import Answer from "@/components/Answer"
import Header from "@/components/Header"
import Progress from "@/components/Progress"
import Tasks from "@/components/Tasks"
import TaskText from "@/components/Text"
import { type Task } from "@/types"

type ApiResponse = {
  success: boolean
  data: Task[]
}

export default async function Home() {
  const response = await fetch("http://localhost:3000/api/restapi?count=5", {
    method: "get",
  })
  const result = (await response.json()) as ApiResponse

  if (!result.success) {
    return <div>En feil har oppstått</div>
  }

  const tasks: Task[] = result.data

  return (
    <main>
      <Header />
      <Tasks tasks={tasks}>
        <Answer />
      </Tasks>
      <TaskText text={"Hva blir resultatet av regneoperasjonen?"} />
      <Progress tasks={tasks} />
    </main>
  )
}
