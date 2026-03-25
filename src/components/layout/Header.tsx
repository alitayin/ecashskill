import Link from "next/link"
import { BookOpen, Code } from "lucide-react"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <BookOpen className="w-6 h-6" />
          ecashskill
        </Link>
        <nav className="flex gap-6">
          <Link
            href="/skills"
            className="flex items-center gap-2 text-sm hover:text-primary"
          >
            <Code className="w-4 h-4" />
            Skills
          </Link>
        </nav>
      </div>
    </header>
  )
}
