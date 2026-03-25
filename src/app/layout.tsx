import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
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
    <html lang="zh-CN" className={geistSans.variable}>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  )
}
