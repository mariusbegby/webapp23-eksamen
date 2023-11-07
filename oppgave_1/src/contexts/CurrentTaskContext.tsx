import { createContext } from "react"

import { type Task } from "@/types"

export const CurrentTaskContext = createContext<Task | null>(null)
