import Image from "next/image"
import Link from "next/link"

export function Sidebar() {
  return (
    <div className="hidden border-r bg-gray-100/40 dark:bg-gray-800/40 lg:block">
      <div className="flex h-[80px] items-center border-b px-6">
        <Link className="flex items-center gap-2 font-semibold" href="#">
          <div className="h-12 w-12">
            <Image
              alt="User avatar"
              className="rounded-full"
              src="/img/logo.png"
              width={48}
              height={48}
            />
          </div>
          <span className="text-2xl">Evolve</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          <Link
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-lg text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="/test"
          >
            <span>Test</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}
