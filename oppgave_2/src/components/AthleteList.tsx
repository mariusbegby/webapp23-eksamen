type Athlete = {
  id: number
  gender: string
  sport: string
}

type AthleteListProps = {
  athletes: Athlete[]
}

export function AthleteList({ athletes }: AthleteListProps) {
  return (
    <ul>
      {athletes.map((athlete) => (
        <li key={athlete.id}>
          {athlete.gender} - {athlete.sport}
        </li>
      ))}
    </ul>
  )
}
