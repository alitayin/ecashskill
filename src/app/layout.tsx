import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { AuroraBackground } from "@/components/AuroraBackground"

export const metadata: Metadata = {
  title: "ecashskill — eCash AI Development Skills",
  description: "Comprehensive eCash blockchain development skills for Claude Code and Cursor. Covers chronik, ecash-lib, ecash-agora, cashtab, and more.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuroraBackground />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
