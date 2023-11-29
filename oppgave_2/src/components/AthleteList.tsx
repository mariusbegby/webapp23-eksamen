import type { Athlete } from "@/types"
import Link from "next/link"

type AthleteListProps = {
  athletes: Athlete[]
}

export function AthleteList({ athletes }: AthleteListProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200 border">
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800"
          >
            Bruker ID
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800"
          >
            Sport
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800"
          >
            Kjønn
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {athletes.map((athlete) => (
          <tr key={athlete.userId}>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 transition-colors duration-200 ease-in-out hover:text-black">
              <Link href={`/athletes/${athlete.userId}`}>{athlete.userId}</Link>
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              {athlete.sport}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              {athlete.gender}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
