type PageProps = {
  title: string
  children: React.ReactNode
}
export function Page({ title, children }: PageProps) {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
        <h1 className="text-xl font-semibold">{title}</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        {children}
      </main>
    </div>
  )
}
