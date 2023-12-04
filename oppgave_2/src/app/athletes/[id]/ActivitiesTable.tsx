import type { Activity, Athlete } from "@/types"
import Link from "next/link"

type ActivitiesProps = {
  athlete: Athlete
  filteredAndSortedActivities?: Activity[]
  filterSport: string | null
  setFilterSport: (sport: string | null) => void
  filterTag: string | null
  setFilterTag: (tag: string | null) => void
  filterReportStatus: string | null
  setFilterReportStatus: (status: string | null) => void
  sortOrder: "asc" | "desc"
  setSortOrder: (order: "asc" | "desc") => void
  handleDeleteActivity: (id: number) => void
  handleDownloadActivity: (id: number) => void
}

export default function AthleteActivities({
  athlete,
  filteredAndSortedActivities,
  filterSport,
  setFilterSport,
  filterTag,
  setFilterTag,
  filterReportStatus,
  setFilterReportStatus,
  sortOrder,
  setSortOrder,
  handleDeleteActivity,
  handleDownloadActivity,
}: ActivitiesProps) {
  const activities = athlete.activities
  const sports = Array.from(
    new Set(activities?.map((activity) => activity.sport) ?? []),
  )
  const tags = Array.from(
    new Set(activities?.map((activity) => activity.tags) ?? []),
  )
  const reportStatuses = ["Ingen rapport", "no", "low", "normal", "high"]

  const id = athlete.userId

  return (
    <div className="col-span-full mt-8">
      <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
        Treningsoversikt
      </h2>
      {activities && activities.length > 0 ? (
        <>
          <div className="mb-4">
            <label className="font-medium text-gray-700 dark:text-gray-200">
              Type:{" "}
              <select
                value={filterSport ?? ""}
                onChange={(e) => {
                  setFilterSport(e.target.value || null)
                }}
                className="mr-4 mt-1 w-32 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Alle</option>
                {sports.map((sport) => (
                  <option key={sport} value={sport}>
                    {sport}
                  </option>
                ))}
              </select>
            </label>

            <label className="font-medium text-gray-700 dark:text-gray-200">
              Tagger:{" "}
              <select
                value={filterTag ?? ""}
                onChange={(e) => {
                  setFilterTag(e.target.value || null)
                }}
                className="mr-4 mt-1 w-40 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Alle</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </label>

            <label className="font-medium text-gray-700 dark:text-gray-200">
              Rapport status:{" "}
              <select
                value={filterReportStatus ?? ""}
                onChange={(e) => {
                  setFilterReportStatus(e.target.value || null)
                }}
                className="mr-4 mt-1 w-40 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Alle</option>
                {reportStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="font-medium text-gray-700 dark:text-gray-200">
              Dato sortering:{" "}
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as "asc" | "desc")
                }}
                className="mr-4 mt-1 w-32 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 sm:text-sm"
              >
                <option value="asc">Stigende</option>
                <option value="desc">Synkende</option>
              </select>
            </label>
          </div>

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
                  Type
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
                  Tags
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200"
                >
                  Rapport status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-800 dark:text-gray-200"
                >
                  Handlinger
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {filteredAndSortedActivities?.map((activity) => (
                <tr key={activity.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 transition-colors duration-200 ease-in-out hover:text-black dark:text-gray-300 dark:hover:text-white">
                    <Link href={`/athletes/${id}/activities/${activity.id}`}>
                      {activity.name}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {activity.sport}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {new Date(activity.date).toLocaleDateString("nb-NO")}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {activity.tags}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {activity.ActivityReport
                      ? activity.ActivityReport.status
                      : "Ingen rapport"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {activity.ActivityReport ? (
                      <Link
                        href={`/athletes/${id}/activities/${activity.id}/reports/${activity.ActivityReport.id}`}
                      >
                        <button className="mr-2 rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-sm font-medium text-white hover:bg-indigo-700">
                          Se rapport
                        </button>
                      </Link>
                    ) : (
                      <Link
                        href={`/athletes/${id}/activities/${activity.id}/reports/new`}
                      >
                        <button className="mr-2 rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-sm font-medium text-white hover:bg-indigo-700">
                          Legg til rapport
                        </button>
                      </Link>
                    )}

                    <Link
                      href={`/athletes/${id}/activities/${activity.id}/edit`}
                    >
                      <button className="mr-2 rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-sm font-medium text-white hover:bg-indigo-700">
                        Endre
                      </button>
                    </Link>
                    {activity.ActivityReport && (
                      <button
                        onClick={() => {
                          handleDownloadActivity(activity.id)
                        }}
                        className="mr-2 rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-sm font-medium text-white hover:bg-indigo-700"
                      >
                        Last ned
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleDeleteActivity(activity.id)
                      }}
                      className="mr-2 rounded-md border border-transparent bg-red-600 px-2 py-1 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Slett
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className="text-lg text-gray-800 dark:text-gray-100">
          Ingen treningsøkter registrert.
        </p>
      )}
    </div>
  )
}
