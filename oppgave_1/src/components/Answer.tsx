"use client"

import { useContext, useState } from "react"
import type { FormEvent, MouseEvent } from "react"

import { CurrentTaskContext } from "@/contexts/CurrentTaskContext"

type ApiResponse = {
  success: boolean
  attempts?: number
}

export default function Answer() {
  const currentTask = useContext(CurrentTaskContext)
  const [answer, setAnswer] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const send = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

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
      return (feedback.textContent = "Feil svar")
    }

    setAttempts(0)
    return (feedback.textContent = "Bra jobbet!")
  }

  const update = (event: FormEvent<HTMLInputElement>) => {
    const valueAsNumber = parseInt(event.currentTarget.value)
    setAnswer(valueAsNumber)
  }

  const getAnswer = () => {
    const button = document.getElementById("checkAnswerButton")
    if (!button) return
    button.textContent = "Svaret er 11"
    return 1
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
        {attempts >= 3
          ? `${attempts} av 3 forsøk, maks antall brukt.`
          : `${attempts} av 3 forsøk`}
      </p>

      {attempts >= 3 ? (
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
