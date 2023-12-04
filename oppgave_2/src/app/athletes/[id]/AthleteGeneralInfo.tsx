import { FaCopy } from "react-icons/fa"
import type { Athlete } from "@/types"

type AthleteGeneralInfoProps = {
  athlete: Athlete
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
  }
}

export default function AthleteGeneralInfo({
  athlete,
}: AthleteGeneralInfoProps) {
  return (
    <div className="grid">
      <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
        Utøverinformasjon
      </h2>
      <p className="text-lg text-gray-800 dark:text-gray-100">
        <strong>Bruker ID:</strong> {athlete.userId}
        <button
          onClick={() => copyToClipboard(athlete.userId)}
          className="ml-2 text-indigo-600 hover:text-indigo-900"
        >
          <FaCopy />
        </button>
      </p>
      <p className="mt-2 text-lg text-gray-800 dark:text-gray-100">
        Utøveren er en <strong>{athlete.gender}</strong> som har{" "}
        <strong>{athlete.sport}</strong> som hovedsport. Det er registrert{" "}
        <strong>{athlete.activities?.length ?? 0}</strong> økter på utøveren.
      </p>
    </div>
  )
}
