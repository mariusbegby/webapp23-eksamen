"use client"

import { useState } from "react"
import type { FormEvent, MouseEvent } from "react"

type ApiResponse = {
  success: boolean
}

export default function Answer() {
  const [answer, setAnswer] = useState(0)

  const send = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    // TODO: get actual id and answer
    const id = "123"
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
      return (feedback.textContent = "Feil svar")
    }

    return (feedback.textContent = "Bra jobbet!")
  }

  const update = (event: FormEvent<HTMLInputElement>) => {
    const valueAsNumber = parseInt(event.currentTarget.value)
    setAnswer(valueAsNumber)
  }

  return (
    <div>
      <label htmlFor="answer">Svar</label>
      <input
        name="answer"
        type="text"
        placeholder="Sett svar her"
        onInput={update}
      />
      <button onClick={send}>Send</button>
      <p id="feedback"></p>

      <div style={{ display: "none" }}>
        {9 + 2 === answer ? "Bra jobbet!" : ""}
      </div>
    </div>
  )
}
