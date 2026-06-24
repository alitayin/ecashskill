import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { AuroraBackground } from "@/components/AuroraBackground"

export const metadata: Metadata = {
  title: "eCash AI Skill",
  description:
    "Maintained eCash AI Skill for Claude Code, Codex, Cursor, OpenCode, and compatible agents. Covers Chronik, ecash-lib, wallets, Agora, Cashtab, PayButton, and testing.",
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
