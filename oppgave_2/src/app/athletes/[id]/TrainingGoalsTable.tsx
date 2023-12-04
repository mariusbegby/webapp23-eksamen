import type { Goal } from "@/types"

type TrainingGoalsProps = {
  goals?: Goal[]
}

export default function TrainingGoals({ goals }: TrainingGoalsProps) {
  return (
    <div className="col-span-full">
      <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100 ">
        Treningsmål
      </h2>
      {goals && goals.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200 border dark:divide-gray-700 dark:bg-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200"
              >
                Navn
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200"
              >
                Mål
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200"
              >
                Dato
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200"
              >
                Kommentar
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {goals.map((goal: Goal) => (
              <tr key={goal.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {goal.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {goal.goal}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {new Date(goal.date).toLocaleDateString("nb-NO")}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {goal.comment == "" ? "Ingen kommentar" : goal.comment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-lg text-gray-800 dark:text-gray-100">
          Ingen treningsmål registrert.
        </p>
      )}
    </div>
  )
}
