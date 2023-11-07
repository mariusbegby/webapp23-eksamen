import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { type Task } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""
  if (process.env.APP_URL) return `https://${process.env.APP_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export const calculateAnswer = (task: Task) => {
  const [a, b] = task.data.split("|")
  switch (task.type) {
    case "add":
      return Number(a) + Number(b)
    case "subtract":
      return Number(a) - Number(b)
    case "multiply":
      return Number(a) * Number(b)
    case "divide":
      return Number(a) / Number(b)
  }
}
