import Link from "next/link"

type PageProps = {
  title: string
  backButtonLocation?: string
  children: React.ReactNode
}
export function Page({ title, backButtonLocation, children }: PageProps) {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
        {backButtonLocation && (
          <Link href={backButtonLocation}>
            <svg
              className="h-6 w-6 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <span>Tilbake</span>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        {children}
      </main>
    </div>
  )
}
