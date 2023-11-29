import "./globals.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { Sidebar } from "@/components/Sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Evolve - Athlete Manager",
  description: "Evolve is a simple athlete manager for coaches.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="no">
      <body className={inter.className}>
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
          <Sidebar />
          <div className="flex flex-col">{children}</div>
        </div>
      </body>
    </html>
  )
}
