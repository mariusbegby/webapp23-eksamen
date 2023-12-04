import type { Contest } from "@/types"

type TrainingContestsProps = {
  contests?: Contest[]
}

export default function TrainingContests({ contests }: TrainingContestsProps) {
  return (
    <div className="col-span-full mt-8">
      <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
        Konkurranser
      </h2>
      {contests && contests.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200 border dark:divide-gray-700 dark:bg-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200">
                Navn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200">
                Mål
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200">
                Lokasjon
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200">
                Dato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200">
                Kommentar
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {contests.map((contest: Contest) => (
              <tr key={contest.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {contest.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {contest.goal}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {contest.location}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {contest.sport}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {new Date(contest.date).toLocaleDateString("nb-NO")}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {contest.comment == "" ? "Ingen kommentar" : contest.comment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-lg text-gray-800 dark:text-gray-100">
          Ingen konkurranser registrert.
        </p>
      )}
    </div>
  )
}
