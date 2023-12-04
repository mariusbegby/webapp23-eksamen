type StatusMessageProps = {
  errorMessage: string | null
  statusMessage: string | null
}

export default function StatusMessage({
  errorMessage,
  statusMessage,
}: StatusMessageProps) {
  return (
    <>
      {errorMessage && (
        <div
          className="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          role="alert"
        >
          <strong className="font-bold">Feilmelding: </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      {statusMessage && (
        <div
          className="relative mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700"
          role="alert"
        >
          <strong className="font-bold">Status: </strong>
          <span className="block sm:inline">{statusMessage}</span>
        </div>
      )}
    </>
  )
}
