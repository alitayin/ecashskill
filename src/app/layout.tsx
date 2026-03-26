import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { AuroraBackground } from "@/components/AuroraBackground"

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "ecashskill",
  description: "AI 开发指南与资源站",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={geistMono.variable}>
      <body className="min-h-screen flex flex-col">
        <AuroraBackground />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
