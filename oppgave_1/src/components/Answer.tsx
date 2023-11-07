"use client"

import { useContext, useEffect, useState } from "react"
import type { FormEvent, MouseEvent } from "react"

import { CurrentTaskContext } from "@/contexts/CurrentTaskContext"
import { calculateAnswer } from "@/lib/utils"

type ApiResponse = {
  success: boolean
  attempts?: number
}

export default function Answer() {
  const MAX_ATTEMPTS = 3

  const { currentTask, tasks, isDone, setIsDone } =
    useContext(CurrentTaskContext)

  const [answer, setAnswer] = useState(0)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    // Reset attempts whenever the current task changes
    setAttempts(0)
  }, [currentTask])

  const send = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (attempts >= MAX_ATTEMPTS) {
      const feedback = document.getElementById("feedback")
      if (feedback) {
        feedback.textContent = "Maks antall forsøk brukt, gå til neste oppgave."
      }
      setIsDone(true)
      return
    }

    const id = currentTask?.id

    const response = await fetch(`http://localhost:3000/api/restapi`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, answer }),
    })

    const result = (await response.json()) as ApiResponse

    const feedback = document.getElementById("feedback")
    if (!feedback) return

    if (!result.success) {
      setAttempts(result.attempts ?? 0)

      if (result.attempts && result.attempts >= MAX_ATTEMPTS) {
        setIsDone(true)
      }
      return (feedback.textContent = "Feil svar")
    }

    setAttempts(0)
    setIsDone(true)
    return (feedback.textContent = "Bra jobbet!")
  }

  const update = (event: FormEvent<HTMLInputElement>) => {
    const valueAsNumber = parseInt(event.currentTarget.value)
    setAnswer(valueAsNumber)
  }

  const getAnswer = () => {
    if (!currentTask) return

    const answer = calculateAnswer(currentTask)

    const button = document.getElementById("checkAnswerButton")
    if (!button) return
    button.textContent = `Svaret er ${answer}`

    return
  }

  return (
    <div id="answer">
      <section>
        <label htmlFor="answer">Ditt svar:</label>
        <input
          name="answer"
          type="text"
          placeholder="Sett svar her"
          onInput={update}
        />
        <button onClick={send}>Send</button>
        <p id="feedback"></p>
      </section>

      <p id="attempts">
        {attempts >= MAX_ATTEMPTS
          ? `${attempts} av 3 forsøk, maks antall brukt.`
          : `${attempts} av 3 forsøk`}
      </p>

      {attempts >= MAX_ATTEMPTS ? (
        <button id="checkAnswerButton" onClick={getAnswer}>
          Se svaret
        </button>
      ) : null}

      <div style={{ display: "none" }}>
        {9 + 2 === answer ? "Bra jobbet!" : ""}
      </div>
    </div>
  )
}
