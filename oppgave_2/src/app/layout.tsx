import "./globals.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { Sidebar } from "@/components/Sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Evolve - Coach assistant",
  description: "Evolve is a coach assistant for managing athletes.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
          <Sidebar />
          <div className="flex flex-col">{children}</div>
        </div>
      </body>
    </html>
  )
}
