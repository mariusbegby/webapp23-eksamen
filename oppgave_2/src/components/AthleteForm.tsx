import { useState } from "react"

type ResponseData = {
  error?: string
}

export function AthleteForm() {
  const [gender, setGender] = useState("")
  const [sport, setSport] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const response = await fetch("/api/athletes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gender, sport }),
    })

    const data = (await response.json()) as ResponseData

    if (!response.ok) {
      setMessage(`Error: ${data.error}`)
    } else {
      setMessage("Athlete created successfully!")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Gender:
        <input
          type="text"
          value={gender}
          onChange={(e) => {
            setGender(e.target.value)
          }}
        />
      </label>
      <label>
        Sport:
        <input
          type="text"
          value={sport}
          onChange={(e) => {
            setSport(e.target.value)
          }}
        />
      </label>
      <button type="submit">Create Athlete</button>

      <p>{message}</p>
    </form>
  )
}
