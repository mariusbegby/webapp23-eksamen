import { FaBolt, FaHeartbeat, FaTachometerAlt } from "react-icons/fa"
import type { Meta } from "@/types"

type PerformanceDataProps = {
  meta: Meta
}

export default function PerformanceData({ meta }: PerformanceDataProps) {
  return (
    <div className="grid">
      <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
        Ytelsesdata
      </h2>
      {meta.heartrate !== null && (
        <span className="inline-flex items-center">
          <FaHeartbeat className="mr-2 text-red-500 dark:text-red-400" />
          <p className="text-lg text-gray-800 dark:text-gray-100">
            Hjerterytme <strong>{meta.heartrate}</strong> slag pr. minutt
          </p>
        </span>
      )}
      {meta.watt !== null && (
        <span className="inline-flex items-center">
          <FaBolt className="mr-2 text-green-500 dark:text-green-400" />
          <p className="text-lg text-gray-800 dark:text-gray-100">
            Terskelwatt: <strong>{meta.watt}</strong> watt
          </p>
        </span>
      )}
      {meta.speed !== null && (
        <span className="inline-flex items-center">
          <FaTachometerAlt className="mr-2 text-blue-500 dark:text-blue-400" />
          <p className="text-lg text-gray-800 dark:text-gray-100">
            Terskelfart: <strong>{meta.speed}</strong> km/t
          </p>
        </span>
      )}
    </div>
  )
}
